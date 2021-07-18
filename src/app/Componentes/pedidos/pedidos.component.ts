import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PedidoCarrito } from 'src/app/models';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  pedido: PedidoCarrito[];
  private pedido$ = new Subject<PedidoCarrito>();
  path = 'Pedidos/'
  uid = '';
  constructor(
    private fireAuth: AuthService,
    private firebase: FirebaseService
  ) {
  }

  ngOnInit(): void {

    this.fireAuth.getUserCurrent().subscribe(res => {
      if (res) {
        this.uid = res.uid;
        this.getPedidos();
      }
    })

  }

  getPedidos() {
    const path = 'Usuarios/' + this.uid + '/' + this.path;
    this.firebase.getCollections<PedidoCarrito>(path).subscribe(res => {
      if (res) {
        this.pedido = res;
        // this.pedido$.next(this.pedido);
        // console.log('tenemos pedidos-> ', this.pedido);

      }
    })

  }

}
