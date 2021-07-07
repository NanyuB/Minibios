import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { Link } from 'src/app/shared/model/links';
import { Minibio } from 'src/app/shared/model/minibio';
import { MinibioService } from 'src/app/shared/services/minibio.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-bio',
  templateUrl: './create-bio.component.html',
  styleUrls: ['./create-bio.component.scss']
})
export class CreateBioComponent implements OnInit {
 bioForm: FormGroup
 id="";
 isSubmitted = false;
 types: any = ['Web', 'Youtube', 'Twitch', 'Instagram', 'Twitter', 'Github','Linkedin','Facebook','Reddit','Tiktok','Pinterest']
 linkForm: FormGroup
 percent:number=0
 mainImage?: string
 downloadURL?: Observable<string>;
 uploadPercent?: Observable<any> ;
  constructor(
    private fb:FormBuilder, 
    private notifier: NotifierService, 
    private minibioService : MinibioService, 
    private route: ActivatedRoute,
    private router : Router,
    private storage: AngularFireStorage ) {
    this.bioForm=this.fb.group({
      title: ["",[Validators.required]],
      description: ["",[Validators.required]],
      image: ["",[Validators.required]],
    })
      this.linkForm=this.fb.group({
        type: ['', [Validators.required]],
        title: ['',[Validators.required]],
        link:['',[Validators.required]]
      })
   }
 
  get f() {
    return this.bioForm.controls
  }
  get t(){
    return this.linkForm.controls
  }

minibio : any;
links: Array<Link> = [] 
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;
     console.log(this.id)
     if (this.id != null) {
      this.minibioService.loadMinibio(this.id).subscribe(data => {
        this.minibio = data.data()
        this.mainImage = this.minibio.image
        this.links = this.minibio.links
        console.log(this.minibio)
        this.bioForm.patchValue({          
        title: this.minibio?.title,
        description: this.minibio?.description,
        image: this.minibio?.image,
        })
      },
        error => {
          console.log("Error:", error);
        }
      )
    }
  };
  guardarlink(){
    if(this.linkForm.invalid) {
      this.notifier.notify('error', 'Los datos no son válidos');
      return
    }
    let newlink: Link={
      type: this.t.type.value,
      title: this.t.title.value,
      link: this.t.link.value
    }
    this.links.push(newlink)
    
    this.notifier.notify('success', "Nuevo enlace creado")
    this.linkForm.patchValue({          
      title: "",
      type: "",
      link: "",
      })
  }
  savebio() {
    if(this.bioForm.invalid) {
      this.notifier.notify('error', 'Los datos no son válidos');
      return
    }
    console.log("Guardar minibio", this.bioForm.value)
    const miniBio: Minibio = {
    title: this.f.title.value,
    description: this.f.description.value,
    id: this.f.title.value,
    links: this.links,
    image: this.f.image.value
    }
this.downloadURL?.subscribe(data => {
    miniBio.image = data})
    this.minibioService.createMinibio(miniBio).then(success => {
      this.notifier.notify('success', "Todo ok!")
      this.router.navigate(["/profile"])
    }).catch(error =>  {
      this.notifier.notify('error', 'Ups, ha ocurrido un error');
    })
  }


 updatePost() {
   const miniBio: Minibio = {
     title: this.f.title.value,
     description: this.f.description.value,
     image: this.f.image.value,
     links: this.links
     }
   this.minibioService.updateMinibio(this.minibio.id, miniBio).then(success => {
    this.notifier.notify('success', "Todo ok!")
    this.router.navigate(["/profile"])
   }).catch(error => {
    this.notifier.notify('error', 'Ups, ha ocurrido un error');
   })
 }
 borrarlink(linkaborrar : Link): void {
  this.links = this.links.filter(
    (i: { type: string; title: string; link: string;}) => i != linkaborrar
  );
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
          this.bioForm.patchValue({
            image: data
          })
        })
      })
   )
  .subscribe()
}

}
