import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Minibio } from '../model/minibio';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MinibioService {

  constructor(private fireStore : AngularFirestore, private authService : AuthService) { }

  createMinibio(data:Minibio) {
    const uid = this.authService.userData().uid
    data.id = this.fireStore.createId()
    return this.fireStore.collection('users').doc(uid).collection('minibios').doc(data.id).set(data)
  }
  
  loadMinibios() {
    const uid = this.authService.userData().uid
    return this.fireStore.collection('users').doc(uid).collection('minibios').get()
  }

  deleteMinibio(id : string){
    const uid = this.authService.userData().uid
    return this.fireStore.collection('users').doc(uid).collection('minibios').doc(id).delete()
  }

  loadMinibio(id : string) {
    const uid = this.authService.userData().uid
    return this.fireStore.collection('users').doc(uid).collection('minibios').doc(id).get()
  }

  updateMinibio(id: string, data: Minibio) {
    const uid = this.authService.userData().uid
    return this.fireStore.collection('users').doc(uid).collection('minibios').doc(id).update(data)
  }

  getMiniBioPublic(userid: string, id: string) {
    return this.fireStore.collection('users').doc(userid).collection('minibios').doc(id).get()
  }
}
