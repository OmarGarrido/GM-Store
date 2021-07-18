import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PedidoCarrito, Producto, ProductoPedido } from 'src/app/models';
import { AuthService } from 'src/app/Servicios/auth.service';
import { CarritoService } from 'src/app/Servicios/carrito.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuario: any;
  pedidos: PedidoCarrito;
  articulos: any[];
  total: number;
  cantidad: number;

  public isMenuCollapsed = true;
  public isCollapsed = true;


  public user$: Observable<any> = this.authServ.afServ.user;
  vacio: any;

  constructor(
    private authServ: AuthService,
    private router: Router,
    private carritoServ: CarritoService,
    private firebaseService: FirebaseService,
  ) { }

  ngOnInit(): void {
    this.cargarCarrito();
    this.authServ.getUserCurrent().subscribe(user => {
      if (user) {
        console.log(user.displayName);
      } else {
        console.log("No estas logueado");
      }
    });

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
        this.vacio = true
        // console.log("Esta vacio");

      } else {
        this.vacio = false
        this.pedidos = resp
        this.articulos = this.pedidos.producto
        this.getCantidad();
        this.getTotat();
        // console.log("Nooooo Esta vacio");
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
    this.firebaseService.sendObjectSorce(this.pedidos)

    this.router.navigate(['Pagos']);
    return

    if (!this.pedidos.producto.length) {
      this.vacio = true;
      return
    }
    this.pedidos.precioTotal = this.total
    this.pedidos.estado = "En Proceso de Envio"
    this.pedidos.id = this.firebaseService.getId();
    const uid = this.carritoServ.getUid();
    const path = "Usuarios/" + uid + "/Pedidos"
    this.firebaseService.crearDoc(path, this.pedidos, this.pedidos.id).then(() => {
      this.carritoServ.clearCarrito();
      console.log("Guardado con exito");

    })
    console.log("comprar-> ", this.pedidos, uid)

  }

  async onLogout() {
    try {
      await this.authServ.logout();
      this.router.navigate(['login']);
    }
    catch (error) {
      console.log(error);
    }
  }
}
