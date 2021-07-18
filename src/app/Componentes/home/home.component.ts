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
  producto: Producto;

  data: any = []
  data2: any = []
  combinado: any

  id: any
  i: number
  config: any

  lista: string[] = ["MXN", "USD", "EUR"];
  dolar: number;
  precio: number;
  mxn: number;
  euro: number;
  opt: string;

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

  agregarCarrito(producto: any) {
    this.producto = {
      marca: producto.marca,
      modelo: producto.modelo,
      precio: producto.precio,
      calificacion: producto.calificacion,
      url: producto.url,
      idFirebase: producto.idFirebase
    }
    // console.log(this.producto);
    this.carritoServ.addProducto(this.producto);

    // this.carritoServ.addProducto(smartphone)

  }

  loadData() {
    this.firebaseServ.getSmartphone().subscribe(
      resp => {
        this.data = resp.map((e: any) => {
          return {
            marca: e.payload.doc.data().marca,
            modelo: e.payload.doc.data().modelo,
            descripcion: e.payload.doc.data().descripcion,
            precio: e.payload.doc.data().precio,
            // procesador: e.payload.doc.data().procesador,
            // camara: e.payload.doc.data().camara,
            // almacenamiento: e.payload.doc.data().almacenamiento,
            calificacion: e.payload.doc.data().calificacion,
            url: e.payload.doc.data().url,
            idFirebase: e.payload.doc.id,
          }
        })
        // console.log('cargando celulares ', this.smart);
      }
    )

    this.firebaseServ.getAccesorios().subscribe(
      resp => {
        this.data2 = resp.map((e: any) => {
          return {
            marca: e.payload.doc.data().marca,
            modelo: e.payload.doc.data().modelo,
            descripcion: e.payload.doc.data().descripcion,
            precio: e.payload.doc.data().precio,
            calificacion: e.payload.doc.data().calificacion,
            url: e.payload.doc.data().url,
            idFirebase: e.payload.doc.id,
          }
        })
        this.combinado = this.data2.concat(this.data)
        // console.log('cargando celulares ', this.combinado);
      }

    )
  }

  modificar() { }


  convert(obj: any) {
    if (!'USD'.indexOf(this.opt)) {
      this.dolar = this.precio / 19.87;
      obj.precio = this.dolar;
      console.log('dolar');

    } else
      if (!'MXN'.indexOf(this.opt)) {
        this.mxn = this.precio;
        obj.precio = this.mxn;
        console.log('peso');
      } else
        if (!'EUR'.indexOf(this.opt)) {
          this.euro = this.precio / 20.03;
          obj.precio = this.euro;
          console.log('euro');
        }


    // obj.precio=this.monto
    console.log('este es el monto', obj.precio)
  }

  verSmartphone(item: any) {
    this.firebaseServ.sendObjectSorce(item)
    this.router.navigate(['detalles', item.idFirebase])
  }

}
