import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBioComponent } from './components/create-bio/create-bio.component';
import { EditPerfilComponent } from './components/edit-perfil/edit-perfil.component';
import { HomeComponent } from './components/home/home.component';
import { MinibioComponent } from './components/minibio/minibio.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  {path:"", component: HomeComponent, pathMatch: "full"},
  {path:"profile", component: ProfileComponent, canActivate: [AuthGuard]},
  {path:"create-bio", component: CreateBioComponent, canActivate: [AuthGuard]},
  {path:"edit-bio/:id", component: CreateBioComponent, canActivate: [AuthGuard]},
  {path:"minibio/:userid/:id", component: MinibioComponent,},
  {path:"profile/edit", component: EditPerfilComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
