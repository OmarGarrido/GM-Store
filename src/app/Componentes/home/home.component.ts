import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from 'src/app/models';
import { AuthService } from 'src/app/Servicios/auth.service';
import { CarritoService } from 'src/app/Servicios/carrito.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  carrito: any = {}
  smart: any = []

  producto: Producto;

  data: any = []
  id: any
  i: number
  config: any

  constructor(
    private firebaseServ: FirebaseService,
    private authServ: AuthService,
    private router: Router,
    private carritoServ: CarritoService
  ) {

    this.authServ.getUserCurrent().subscribe(res => {
      // console.log(res);
      if (res) {
        // this.loadCarrito();
      }
    })
  }


  loadCarrito() {
    console.log('cargando carrito');
  }

  ngOnInit(): void {
    this.loadData();
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.data.length
    };
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

  agregarCarrito(smartphone: any) {
    this.producto = {
      marca: smartphone.marca,
      modelo: smartphone.marca,
      precio: smartphone.precio,
      // calificacion: smartphone.calificacion,
      url: smartphone.url,
      idFirebase: smartphone.idFirebase
    }
    // console.log(this.producto);
    this.carritoServ.addProducto(this.producto);

    // this.carritoServ.addProducto(smartphone)

  }

  loadData() {
    this.firebaseServ.getMoto().subscribe(
      resp => {
        this.data = resp.map((e: any) => {
          return {
            marca: e.payload.doc.data().marca,
            modelo: e.payload.doc.data().modelo,
            descripcion: e.payload.doc.data().descripcion,
            precio: e.payload.doc.data().precio,
            categoria: e.payload.doc.data().categoria,
            existencias: e.payload.doc.data().existencias,
            url: e.payload.doc.data().url,
            idFirebase: e.payload.doc.id,
          }
        })
        this.smart = this.data
        // console.log('cargando celulares ', this.smart);
      }
    )
  }

  modificar(){}

  verSmartphone(item: any) {    
    this.firebaseServ.sendObjectSorce(item)
    this.router.navigate(['detalles', item.idFirebase])
  }

}
