import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css']
})
export class DetallesComponent implements OnInit {

  smartPhone: any={}
  constructor(
    private firebaseServ: FirebaseService
  ) {}


  ngOnInit(): void {
    this.firebaseServ.$getObjecjtSorce.subscribe(data=>this.smartPhone=data).unsubscribe();
    console.log(this.smartPhone);
  }

}
