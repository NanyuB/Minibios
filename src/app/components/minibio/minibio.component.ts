import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Minibio } from 'src/app/shared/model/minibio';
import { MinibioService } from 'src/app/shared/services/minibio.service';

@Component({
  selector: 'app-minibio',
  templateUrl: './minibio.component.html',
  styleUrls: ['./minibio.component.scss']
})
export class MinibioComponent implements OnInit {
  isNightMode: boolean = false;

  minibio : any;
  constructor(
    private minibioService : MinibioService,
    private route: ActivatedRoute,
    ) { 
    let userId = this.route.snapshot.paramMap.get('userid') ?? ""
    let bioId = this.route.snapshot.paramMap.get('id') ?? ""
    this.minibioService.getMiniBioPublic(userId, bioId).subscribe(data => {
    this.minibio = data.data() as Minibio
    this.minibio.id = data.id}
    )
  console.log(this.minibio)}

    ngOnInit(): void {
    }

  darkMode() {
    this.isNightMode = !this.isNightMode;
    document.body.classList.toggle('dark');
  }
}
