import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'protractor';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  data:any=[]
  id:any
  i:number

  constructor(
    private firebaseServ: FirebaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.firebaseServ.getSmartphone().subscribe(
      resp=>{
        this.data=resp.map((e:any)=>{
          return{
            marca: e.payload.doc.data().marca,
            descripcion: e.payload.doc.data().descripcion,
            precio: e.payload.doc.data().precio,
            procesador:e.payload.doc.data().procesador,
            camara: e.payload.doc.data().camara,
            almacenamiento: e.payload.doc.data().almacenamiento,
            calificacion: e.payload.doc.data().calificacion,
            url: e.payload.doc.data().url,
            idFirebase: e.payload.doc.id,
          }
        })
      }
    )

  }

  verSmartphone(item:any){
    this.firebaseServ.sendObjectSorce(item)
    this.router.navigate(['detalles',item.marca])
  }

}
