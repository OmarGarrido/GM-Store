import { Component, OnInit } from '@angular/core';
import { PedidoCarrito } from 'src/app/models';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
})
export class PedidosComponent implements OnInit {
  pedidos: PedidoCarrito[];
  uid: string;

  fech=new Date()
  constructor(
    private firebaseServ: FirebaseService,
    private fireAuth: AuthService
  ) {}
  ngOnInit(): void {
    
    console.log(this.fech.toDateString());
    
    this.fireAuth.getUserCurrent().subscribe((res) => {
      if (res) {
        this.uid = res.uid;
        this.firebaseServ
          .getPedidos<PedidoCarrito>(res.uid)
          .subscribe((pedido) => {
            this.pedidos = pedido;
            console.log(pedido);
          });
      }
    });

    // this.getUserUid();
  }
}
