import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-edit-perfil',
  templateUrl: './edit-perfil.component.html',
  styleUrls: ['./edit-perfil.component.scss']
})
export class EditPerfilComponent implements OnInit {
mForm: FormGroup
percent:number=0
mainImage?: string
foto?: string
downloadURL?: Observable<string>;
uploadPercent?: Observable<any> ;
user: any
  constructor(
    private fb : FormBuilder, 
    private authService : AuthService, 
    private notifier : NotifierService,
    private storage: AngularFireStorage) {
    this.mForm=this.fb.group({
      username: ['',[Validators.required, Validators.minLength(3)]],
      image: ["",[Validators.required]], })
   }

  ngOnInit(): void {
    this.user =this.authService.userData()
    console.log(this.user)
    const name = this.user.displayName
    const username = this.user.username
    this.mainImage = this.user.image
    this.foto = this.user.photoURL
    this.mForm.patchValue({
      username : username || name,
      image: this.mainImage || this.foto
      
    })
  }
  get f() {
    return this.mForm.controls
  }
saveUser(){
if (this.mForm.invalid){
  this.notifier.notify('error', "El nombre de usuario no es válido")
  return
}
let newdata : any = {
  username: this.f.username.value,
  image: this.f.image.value
}
this.authService.updateProfile(newdata).then(success =>{
this.notifier.notify('success', "Se ha guardado correctamente")
this.authService.updateLocalData(newdata)  
setTimeout(function(){
  window.location.reload()},500);
}).catch(error => {
  this.notifier.notify('error', "Ha ocurrido un error")
})

}

uploadFile(event: any) {
  const file = event.target.files[0];
  const filePath = Date.now() + file.name;
  const fileRef = this.storage.ref(filePath);
  const task = this.storage.upload(filePath, file)
  // observe percentage changes
  task.percentageChanges().subscribe(number => {
    this.percent = number!
  })
  // get notified when the download URL is available
  task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL()
        this.downloadURL.subscribe(data => {
          this.mForm.patchValue({
            image: data
          })
        })
      })
   )
  .subscribe()
}
}
