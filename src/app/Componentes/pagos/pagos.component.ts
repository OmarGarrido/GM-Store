import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PedidoCarrito, Producto } from 'src/app/models';
import { CarritoService } from 'src/app/Servicios/carrito.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {

  carrito:any={}
  closeResult: string;

  pedidos: PedidoCarrito;
  articulos: any[];
  total: number;
  cantidad: number;
  vacio: boolean;
  pagado:boolean=true;

  constructor(
    private firebaseServ:FirebaseService,
    private modalService: NgbModal,
    private carritoServ:CarritoService,
    private router:Router
  ) { }

  ngOnInit(): void {
    // this.firebaseServ.$getObjecjtSorce.subscribe(data=>this.carrito=data).unsubscribe();
    // console.log(this.carrito)
    this.cargarCarrito()
  }
  add(producto: Producto) {
    this.cargarCarrito();
    this.carritoServ.addProducto(producto);

  }

  delete(producto: Producto) {
    this.carritoServ.removeProducto(producto);
    this.cargarCarrito();        
  }

  cargarCarrito() {
    this.carritoServ.getCarrito().subscribe(resp => {
      if (!resp.producto.length) {
        console.log("Esta vacio");
        this.router.navigate(['Pedidos']);
        this.vacio = true
      } else {
        this.vacio = false
        this.pedidos = resp
        this.articulos = this.pedidos.producto
        this.getCantidad();
        this.getTotat();
        console.log("Nooooo Esta vacio ",this.articulos);
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
      this.carrito=null

    })
    console.log("comprar-> ", this.pedidos, uid)

  }

  nuevoPago(content) {
    this.pagado=false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  validarPago(){
    this.pagado=false;
  }
  
  cerrar(){
    this.modalService.dismissAll();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


}
