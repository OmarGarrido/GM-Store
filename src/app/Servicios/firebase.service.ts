import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  objecjSorce = new BehaviorSubject<{}>({})
  data: any = []

  $getObjecjtSorce = this.objecjSorce.asObservable();


  constructor(
    private firestore: AngularFirestore,
    private router: Router) { }

  getUser() {
    return this.firestore.collection("usuarios").snapshotChanges();
  }

  createUser(user: any) {
    return this.firestore.collection("usuarios").add(user);
  }

  sendObjectSorce(data: any) {
    this.objecjSorce.next(data);
  }

  getSmartphone() {
    return this.firestore.collection("Smartphone").snapshotChanges();
  }

  createSmartphone(Smartphone: any) {
    return this.firestore.collection("Smartphone").add(Smartphone);
  }

  updateSmartphone(id: any, Smartphone: any) {
    return this.firestore.collection("Smartphone").doc(id).update(Smartphone);
  }

  eliminarSmartphone(id: any) {
    return this.firestore.collection("Smartphone").doc(id).delete();
  }

  agregarUrl(Smartphone: any) {
    return this.firestore.collection("Smartphone").doc(Smartphone.id).update(Smartphone.url);
  }


}


