import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getuid } from 'process';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { CarritoService } from './carrito.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  objecjSorce = new BehaviorSubject<{}>({});
  data: any = [];

  $getObjecjtSorce = this.objecjSorce.asObservable();

  constructor(
    private firestore: AngularFirestore,
    private fireAuth: AuthService
  ) {}

  getPedidos<tipo>(uid: string) {
    const path = 'Usuarios/' + uid + '/' + 'pedidos';
    return this.firestore.collection<tipo>(path).valueChanges();
  }

  getUser() {
    return this.firestore.collection('usuarios').snapshotChanges();
  }

  createUser(user: any) {
    return this.firestore.collection('usuarios').add(user);
  }

  sendObjectSorce(data: any) {
    this.objecjSorce.next(data);
  }

  getMoto() {
    return this.firestore.collection('Motos').snapshotChanges();
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

  //
  createMoto(moto: any) {
    return this.firestore.collection('Motos').add(moto);
  }

  updateMoto(id: any, Moto: any) {
    return this.firestore.collection('Motos').doc(id).update(Moto);
  }

  eliminarMoto(id: any) {
    return this.firestore.collection('Motos').doc(id).delete();
  }

  agregarUrl(Moto: any) {
    return this.firestore.collection('Motos').doc(Moto.id).update(Moto.url);
  }

  createPedido(path: string, data: any) {
    return this.firestore.collection(path).add(data);
  }
  deletDoc(path: string, id: string) {
    return this.firestore.collection(path).doc(id).delete();
  }
}
