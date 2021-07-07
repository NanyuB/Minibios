import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-menu-user',
  templateUrl: './menu-user.component.html',
  styleUrls: ['./menu-user.component.scss']
})
export class MenuUserComponent implements OnInit {
  user: any
  fotopropia: any
  constructor(
    private authService: AuthService) { }


  ngOnInit(): void {
    this.user = this.authService.userData();
    this.fotopropia = this.user.image
  }
  logout() {
    this.authService.signOut()
  }
}
