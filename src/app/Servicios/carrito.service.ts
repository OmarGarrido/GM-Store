import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Producto, PedidoCarrito, Usuario, ProductoPedido } from '../models';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private pedido: PedidoCarrito;
  private usuario: Usuario;

  path = 'carrito/';
  uid = ''

  constructor(
    public fireAuth: AuthService,
    public fireBase: FirebaseService,
    public router: Router
  ) {

    this.fireAuth.getUserCurrent().subscribe(res => {
      if (res) {
        this.uid = res.uid;
        this.loadCliente();
      }

    })

  }

  loadCarrito() {
    const path = 'Usuarios/' + this.uid + '/' + this.path;
    this.fireBase.getDoc<PedidoCarrito>(path, this.uid).subscribe(res => {
      // console.log(res);
      if (res) {
        this.pedido = res;
        console.log('hay Productos en Carrito');

      } else {
        console.log('no hay nada en carrito');
        this.initCarrito();
      }

    });
  }

  initCarrito() {
    this.pedido = {
      id: this.uid,
      usuario: this.usuario,
      producto: [],
      precioTotal: null,
      estado: 'Enviado',
    }
  }

  loadCliente() {
    const path = 'Usuarios';
    this.fireBase.getDoc<Usuario>(path, this.uid).subscribe(res => {
      this.usuario = res
      // console.log('Usuario-> ', this.usuario);

      this.loadCarrito();
    })
  }

  addProducto(producto: Producto) {
    // console.log('info recibida ',producto);

    if (this.uid.length) {
      const item = this.pedido.producto.find(productosPedido => {
        return (productosPedido.producto.idFirebase === producto.idFirebase)
      });

      if (item) {
        item.cantidad++;
      } else {
        const pedido: ProductoPedido = {
          cantidad: 1,
          producto
          // ó 
          //producto:producto
        }
        this.pedido.producto.push(pedido)
      }
    } else {
      this.router.navigate(['register']);
    }
    // console.log('en add pedido-> ', this.pedido);
    const path = 'Usuarios/' + this.uid + '/' + this.path;
    this.fireBase.crearDoc(path, this.pedido, this.uid).then(() => {
      console.log('añadido con exito a la base de datos');

    });

  }

  getCarrito() {
    return this.pedido
  }

  removeProducto(producto: Producto) {

  }

  realizarPedido() {

  }

  clearCarrito() {

  }
}
