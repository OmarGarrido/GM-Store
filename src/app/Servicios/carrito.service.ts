import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Producto, PedidoCarrito, Usuario, ProductoPedido } from '../models';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private pedido: PedidoCarrito;
  private pedido$ = new Subject<PedidoCarrito>();
  private usuario: Usuario;

  path = 'carrito/';
  uid = ''

  constructor(
    public fireAuth: AuthService,
    public fireBase: FirebaseService,
    public router: Router,
  ) {


    this.initCarrito();
    this.fireAuth.getUserCurrent().subscribe(res => {
      if (res) {
        this.uid = res.uid;
        this.loadCliente();
      }

    })

  }



  getUid() {
    this.fireAuth.getUserCurrent().subscribe(res => {
      this.uid = res.uid;
    })
    return this.uid
  }

  loadCarrito() {
    const path = 'Usuarios/' + this.uid + '/' + this.path;
    this.fireBase.getDoc<PedidoCarrito>(path, this.uid).subscribe(res => {
      // console.log(res);
      if (res) {
        this.pedido = res;
        this.pedido$.next(this.pedido);
        // console.log('hay Productos en Carrito-> ', this.pedido);

      } else {
        // console.log('no hay nada en carrito');
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
    };
    this.pedido$.next(this.pedido);
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
        if (item.cantidad < item.producto.existencias) {

          item.cantidad++;
        } else {
          // console.log('nueva funcon ', item);
          console.log('ya no hay existencias');
          return
        }
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
      this.router.navigate(['login']);
      return
    }
    // console.log('en add pedido-> ', this.pedido);
    const path = 'Usuarios/' + this.uid + '/' + this.path;
    this.fireBase.crearDoc(path, this.pedido, this.uid).then(() => {
      console.log('añadido con exito a la base de datos');

    });

  }

  getCarrito(): Observable<PedidoCarrito> {
    setTimeout(() => {
      this.pedido$.next(this.pedido);
    }, 250)
    return this.pedido$.asObservable();
  }

  removeProducto(producto: Producto) {
    if (this.uid.length) {
      let posicion = 0;
      const item = this.pedido.producto.find((productosPedido, index) => {
        posicion = index;
        return (productosPedido.producto.idFirebase === producto.idFirebase)
      });

      if (item) {
        item.cantidad--;
        if (item.cantidad == 0) {
          this.pedido.producto.splice(posicion, 1);
        }
      }
      const path = 'Usuarios/' + this.uid + '/' + this.path;
      this.fireBase.crearDoc(path, this.pedido, this.uid).then(() => {
        console.log('eliminado con exito');

      });
    }

  }

  realizarPedido() {

  }

  clearCarrito() {
    const path = 'Usuarios/' + this.uid + '/' + this.path;
    this.fireBase.deleteDoc(path, this.uid).then(() => {
      this.initCarrito();
    })
  }
}
