import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from 'src/app/models';
import { CarritoService } from 'src/app/Servicios/carrito.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css']
})
export class DetallesComponent implements OnInit {

  smartPhone: any = {}
  descripcion:any

  lista: string[] = ["MXN", "USD", "EUR"];
  dolar: number;
  euro: number;
  mxn: number;
  precio: number;
  opt: any
  cantidad: number;
  pedidos: any;
  total: any;
  articulos: any;
  vacio: boolean;
  constructor(
    private firebaseServ: FirebaseService,
    private router: Router,
    private carritoServ:CarritoService
  ) { }

 hola="hola como estas"
  ngOnInit(): void {
    this.firebaseServ.$getObjecjtSorce.subscribe(data => this.smartPhone = data).unsubscribe();
    this.precio = this.smartPhone.precio;
    this.descripcion=this.smartPhone.descripcion.split("\n")
    console.log(this.descripcion);
    
    // this.descripcion=this.smartPhone.descripcion.spli()
    // console.log("Este es el precio original ", this.precio);
    // console.log("producto ", this.smartPhone);

    // console.log(this.smartPhone.idFirebase);
  }

  add(producto: Producto) {
    this.cargarCarrito();
    this.carritoServ.addProducto(producto);
  if(this.carritoServ.uid.length!=0){
    this.router.navigate(['Pagos']);
  }    
  }

  delete(producto: Producto) {
    this.carritoServ.removeProducto(producto);
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.carritoServ.getCarrito().subscribe(resp => {
      if (!resp.producto.length) {
        this.vacio = true
        console.log("Esta vacio");

      } else {
        this.vacio = false
        this.pedidos = resp
        this.articulos = this.pedidos.producto
        this.getCantidad();
        this.getTotat();
        console.log("Nooooo Esta vacio");
      }
    })
  }

  getTotat() {
    this.total = 0
    this.pedidos.producto.forEach(producto => {
      this.total = ((producto.producto.precio) * producto.cantidad) + this.total;
    });
    this.pedidos.precioTotal = this.total
  }

  getCantidad() {
    this.cantidad = 0
    this.pedidos.producto.forEach(producto => {
      this.cantidad = producto.cantidad + this.cantidad
    });
  }

  comprar() {
    // this.firebaseServ.sendObjectSorce(this.pedidos)


    this.router.navigate(['Pagos']);
    return

    if (!this.pedidos.producto.length) {
      this.vacio = true;
      return
    }
    this.pedidos.precioTotal = this.total
    this.pedidos.estado = "En Proceso de Envio"
    this.pedidos.id = this.firebaseServ.getId();
    const uid = this.carritoServ.getUid();
    const path = "Usuarios/" + uid + "/Pedidos"
    this.firebaseServ.crearDoc(path, this.pedidos, this.pedidos.id).then(() => {
      this.carritoServ.clearCarrito();
      console.log("Guardado con exito");

    })
    console.log("comprar-> ", this.pedidos, uid)

  }

  verSmartphone(item: any) {
    this.firebaseServ.sendObjectSorce(item)
    // console.log(item.idFirebase);
    
    this.router.navigate(['Pagos', item.idFirebase])
  }

  convert(obj: any) {
    if (!'USD'.indexOf(this.opt)) {
      this.dolar = this.precio / 19.87;
      obj.precio = this.dolar;
    } else
      if (!'MXN'.indexOf(this.opt)) {
        this.mxn = this.precio;
        obj.precio = this.mxn;
      } else
        if (!'EUR'.indexOf(this.opt)) {
          this.euro = this.precio / 20.03;
          obj.precio = this.euro;
        }


    // obj.precio=this.monto
    // console.log('este es el monto',obj.precio)
  }

}
