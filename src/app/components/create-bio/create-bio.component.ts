import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Link } from 'src/app/shared/model/links';
import { Minibio } from 'src/app/shared/model/minibio';
import { MinibioService } from 'src/app/shared/services/minibio.service';

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
  constructor(
    private fb:FormBuilder, 
    private notifier: NotifierService, 
    private minibioService : MinibioService, 
    private route: ActivatedRoute,
    private router : Router ) {
    this.bioForm=this.fb.group({
      title: ["",[Validators.required]],
        description: ["",[Validators.required]],
        image: ["",[Validators.required]],})
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
    image: this.f.image.value,
    id: this.f.title.value,
    links: this.links
    }
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
}
