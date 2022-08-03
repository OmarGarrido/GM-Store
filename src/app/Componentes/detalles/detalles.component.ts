import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css']
})
export class DetallesComponent implements OnInit {

  smartPhone: any = {}

  lista: string[] = ["MXN", "USD", "EUR"];
  dolar: number;
  euro: number;
  mxn: number;
  precio: number;
  opt: any
  calificacion
  constructor(
    private firebaseServ: FirebaseService,
    private router: Router
    ) { 
    this.calificacion=Math.random()*(5-1)+1

  }


  ngOnInit(): void {
    this.firebaseServ.$getObjecjtSorce.subscribe(data => this.smartPhone = data).unsubscribe();
    this.precio = this.smartPhone.precio;
    console.log("Este es el precio original ", this.precio);

    // console.log(this.smartPhone.idFirebase);
  }

  verSmartphone(item: any) {
    this.firebaseServ.sendObjectSorce(item)
    this.router.navigate(['Pagos', item.marca])
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
