import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  PedidoCarrito,
  Producto,
  ProductoPedido,
  Usuario,
} from 'src/app/models';
import { AuthService } from 'src/app/Servicios/auth.service';
import { CarritoService } from 'src/app/Servicios/carrito.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  usuario: any;
  pedidos: PedidoCarrito = {
    id: '',
    // usuario: '',
    producto: [],
    precioTotal: 0,
    estado: 'Enviado',
  };
  articulos: any[];
  total: number;

  public isMenuCollapsed = true;
  public isCollapsed = true;
  public cliente: Usuario = { nombre: '', uid: '', administrador: false };

  public user$: Observable<any> = this.authServ.afServ.user;

  constructor(
    private authServ: AuthService,
    private router: Router,
    private carritoServ: CarritoService,
    private firebaseServ: FirebaseService
  ) {}

  ngOnInit(): void {
    this.cargarCarrito;
    this.usuario = this.carritoServ.getCliente();
    this.user$.subscribe((u)=>{

      console.log(u);
    })
    
    // this.authServ.getUserCurrent().subscribe((user) => {
    //   if (user) {
    //     this.id=user.uid
    //     // console.log(user.displayName);
    //   } else {
    //     console.log('No estas logueado');
    //   }
    // });
  }

  Pagar() {
    // this.firebaseServ.sendObjectSorce(item);
    this.router.navigate(['Pagos', this.usuario.uid]);
  }

  add(producto: Producto) {
    this.carritoServ.addProducto(producto);
    this.cargarCarrito();
  }

  delete(producto: Producto) {
    this.carritoServ.removeProducto(producto);
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.pedidos = this.carritoServ.getCarrito();
    this.articulos = this.pedidos.producto;
  }

  async onLogout() {
    try {
      await this.authServ.logout();
      this.router.navigate(['login']);
    } catch (error) {
      console.log(error);
    }
  }
}
