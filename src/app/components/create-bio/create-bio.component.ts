import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
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
  constructor(
    private fb:FormBuilder, 
    private notifier: NotifierService, 
    private minibioService : MinibioService, 
    private route: ActivatedRoute,
    private router : Router ) {
    this.bioForm=this.fb.group({
title: ["",Validators.required],
description: ["",Validators.required],
image: ["",Validators.required],
linkTitle1: ["",Validators.required],
linkURL1: ["",Validators.required],
linkTitle2: ["",Validators.required],
linkURL2: ["",Validators.required],
linkTitle3: ["",Validators.required],
linkURL3: ["",Validators.required]
    })
   }
   get f() {
    return this.bioForm.controls
  }
minibio : any;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;
     console.log(this.id)
     if (this.id != null) {
      this.minibioService.loadMinibio(this.id).subscribe(data => {
        this.minibio = data.data()
        console.log(this.minibio)
        this.bioForm.patchValue({          
        title: this.minibio?.title,
        description: this.minibio?.description,
        image: this.minibio?.image,
        linkTitle1: this.minibio?.linkTitle1,
        linkURL1: this.minibio?.linkURL1,
        linkTitle2: this.minibio?.linkTitle2,
        linkURL2: this.minibio?.linkURL2,
        linkTitle3: this.minibio?.linkTitle3,
        linkURL3: this.minibio?.linkURL3,

        })
      },
        error => {
          console.log("Error:", error);
        }
      )
    }
  };
  
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
    linkTitle1: this.f.linkTitle1.value,
    linkURL1: this.f.linkURL1.value,
    linkTitle2: this.f.linkTitle2.value,
    linkURL2: this.f.linkURL2.value,
    linkTitle3: this.f.linkTitle3.value,
    linkURL3: this.f.linkURL3.value,
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
     linkTitle1: this.f.linkTitle1.value,
     linkURL1: this.f.linkURL1.value,
     linkTitle2: this.f.linkTitle2.value,
     linkURL2: this.f.linkURL2.value,
     linkTitle3: this.f.linkTitle3.value,
     linkURL3: this.f.linkURL3.value,
     }
   this.minibioService.updateMinibio(this.minibio.id, miniBio).then(success => {
    this.notifier.notify('success', "Todo ok!")
    this.router.navigate(["/profile"])
   }).catch(error => {
    this.notifier.notify('error', 'Ups, ha ocurrido un error');
   })
 }

}
