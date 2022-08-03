import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarritoService } from 'src/app/Servicios/carrito.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
})
export class PagosComponent implements OnInit {
  carrito: any = {};
  closeResult: string;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private carritoServ: CarritoService
  ) {}

  ngOnInit(): void {
    this.carrito = this.carritoServ.getCarrito();
    // this.firebaseServ.$getObjecjtSorce
    //   .subscribe((data) => (this.smartPhone = data))
    //   .unsubscribe();
    console.log(this.carrito);
  }

  Pedidos() {
    this.carritoServ.realizarPedido();
    this.router.navigate(['Pedidos']);
  }

  nuevoPago(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  cerrar() {
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
