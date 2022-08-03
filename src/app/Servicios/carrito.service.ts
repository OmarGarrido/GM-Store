import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Producto, PedidoCarrito, Usuario, ProductoPedido } from '../models';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private pedido: PedidoCarrito;
  private usuario: Usuario;

  path = 'carrito/';
  uid = '';
  totalNeto = 0;

  constructor(
    public fireAuth: AuthService,
    public fireBase: FirebaseService,
    public router: Router
  ) {
    this.fireAuth.getUserCurrent().subscribe((res) => {
      if (res) {
        this.uid = res.uid;
        this.loadCliente();
      }
    });
  }

  getCliente() {
    return this.usuario;
  }

  private loadCarrito() {
    const path = 'Usuarios/' + this.uid + '/' + this.path;
    this.fireBase.getDoc<PedidoCarrito>(path, this.uid).subscribe((res) => {
      // console.log(res);
      if (res) {
        this.pedido = res;
        console.log('hay Productos en Carrito-> ', this.pedido);
      } else {
        console.log('no hay nada en carrito');
        this.initCarrito();
      }
    });
  }

  private initCarrito() {
    this.pedido = {
      id: this.uid,
      usuario: this.usuario,
      producto: [],
      precioTotal: 0,
      estado: 'Enviado',
    };
  }

  loadCliente() {
    const path = 'Usuarios';
    this.fireBase.getDoc<Usuario>(path, this.uid).subscribe((res) => {
      this.usuario = res;
      console.log('Usuario-> ', this.usuario);

      this.loadCarrito();
    });
  }

  addProducto(producto: Producto) {
    // console.log('info recibida ',producto);

    if (this.uid.length) {
      const item = this.pedido.producto.find((productosPedido) => {
        return productosPedido.producto.idFirebase === producto.idFirebase;
      });

      if (item) {
        item.cantidad++;
        item.total = producto.precio * item.cantidad;
      } else {
        const pedido: ProductoPedido = {
          cantidad: 1,
          producto,
          total: producto.precio,
          // ó
          //producto:producto
        };
        this.pedido.producto.push(pedido);
      }
      this.total(this.pedido);
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
    return this.pedido;
  }

  total(item: PedidoCarrito) {
    this.totalNeto = 0;
    item.producto.forEach((e) => (this.totalNeto = this.totalNeto + e.total));
    this.pedido.precioTotal = this.totalNeto;
  }

  removeProducto(producto: Producto) {
    if (this.uid.length) {
      let posicion = 0;
      const item = this.pedido.producto.find((productosPedido, index) => {
        posicion = index;
        return productosPedido.producto.idFirebase === producto.idFirebase;
      });

      if (item) {
        item.cantidad--;
        item.total = producto.precio * item.cantidad;
        if (item.cantidad == 0) {
          this.pedido.producto.splice(posicion, 1);
        }
      }
      this.total(this.pedido);
      const path = 'Usuarios/' + this.uid + '/' + this.path;
      this.fireBase.crearDoc(path, this.pedido, this.uid).then(() => {
        console.log('eliminado con exito');
      });
    }
  }

  realizarPedido() {
    this.pedido.fecha = new Date();
    const path = 'Usuarios/' + this.uid + '/' + 'pedidos/';
    this.fireBase.createPedido(path, this.pedido).then(() => {
      console.log('Pedido realizado con exito');
      this.clearCarrito();
    });
  }

  private clearCarrito() {
    const path = 'Usuarios/' + this.uid + '/' + this.path;
    this.fireBase.deletDoc(path, this.uid).then(() => {
      this.initCarrito();
      console.log('Carrito limpiado con exito!!');
    });
  }
}
