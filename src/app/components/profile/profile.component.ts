import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Minibio } from 'src/app/shared/model/minibio';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MinibioService } from 'src/app/shared/services/minibio.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  minibios: Array<Minibio> = []
  user: any
  isLoading = false
  constructor(
    private authService: AuthService,
    private router: Router,
    private minibioService: MinibioService) { }

  ngOnInit(): void {
    this.user = this.authService.userData()
    this.loadMinibios()
  }
  btncreatebio() {
    this.router.navigateByUrl('/create-bio')
  }

  loadMinibios() {
    this.minibioService.loadMinibios().subscribe(data => {
      this.minibios = []
      data.forEach((doc: any) => {
        let myminibio: Minibio = doc.data()
        myminibio.id = doc.id
        this.minibios.push(myminibio)
        this.isLoading = false
      })
    })
  }

  borrarMinibio(idminibio: any) {
    this.minibioService.deleteMinibio(idminibio).then(success => {
      console.log("Se ha eliminado correctamente")
      this.loadMinibios()
    }).catch(error => {
      console.error("Problema eliminado")
    })
  }
  visit(id: any) {
    const uid = this.authService.userData().uid
    this.router.navigate(["minibio/" + uid + "/" + id])
  }
}
