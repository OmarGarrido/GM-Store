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

  getId() {
    return this.firestore.createId();
  }

  getUser() {
    return this.firestore.collection("usuarios").snapshotChanges();
  }

  createUser(user: any) {
    return this.firestore.collection("usuarios").add(user);
  }

  sendObjectSorce(data: any) {
    this.objecjSorce.next(data);
  }

  getCollections<tipo>(path: string) {
    const coollection= this.firestore.collection<tipo>(path);
    return coollection.valueChanges();
  }

  getSmartphone() {
    return this.firestore.collection("Smartphone").snapshotChanges();
  }

  getAccesorios() {
    return this.firestore.collection('Accesorios').snapshotChanges();
  }

  // metodo alterno para cargar coleciones generico
  getDoc<tipo>(path: string, id: string) {
    const collection = this.firestore.collection<tipo>(path);
    return collection.doc(id).valueChanges();
    // return this.firestore.collection(path).snapshotChanges();
  }

  crearDoc(path: string, data: any, id: string) {
    const collection = this.firestore.collection(path);
    return collection.doc(id).set(data);
  }

  deleteDoc(path: string, id: string) {
    const collection = this.firestore.collection(path);
    return collection.doc(id).delete();
  }
  //

  updateArticulo(path: string, id: any, Smartphone: any) {
    return this.firestore.collection(path).doc(id).update(Smartphone);
  }

  createArticulo(path: string, item: any) {
    return this.firestore.collection(path).add(item);
  }

  // 
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


