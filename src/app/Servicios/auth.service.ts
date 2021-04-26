import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { AngularFireAuth } from  "@angular/fire/auth";
import firebase from "firebase/app";
import 'firebase/auth'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public afServ:AngularFireAuth,
    public router:Router
  ) { }

  async loginGoogle() {
    try {
      //sintaxys nueva descubierta por mi
       this.afServ.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      }
    catch (error) {
      console.log(error);
    }
  }

  async register(email:string, password:string){
    const result= await this.afServ.createUserWithEmailAndPassword(email,password);
    this.router.navigate(['Inicio']);
    return result;
  }

  async login(email:string, password:string){
    const result= await this.afServ.signInWithEmailAndPassword(email,password);
    this.router.navigate(['Inicio']);
    return result;
  }

  async logout(){
    const result= await this.afServ.signOut();
    this.router.navigate(['home']);
    return result;
  }


}
