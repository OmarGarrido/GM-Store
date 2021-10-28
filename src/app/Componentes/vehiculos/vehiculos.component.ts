import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Usuario, Vehiculos } from 'src/app/models';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {
  public user$: Observable<any> = this.authServ.afServ.user;
  collection = { data: [] }
  collection2 = { data: [] }
  array: any

  fabricanteForm: FormGroup;
  vehiculoForm: FormGroup;
  idFirebaseUpdate: string;
  updSave: boolean;
  path: string = "Vehiculos/"

  //interfaces
  vehiculos: Vehiculos[];

  admin: any;

  urrAux: string

  config: any
  closeResult = "";

  //
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  urlFInd: Subscription;
  usuario: Usuario;

  constructor(
    private authServ: AuthService,
    private firebaseService: FirebaseService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    private fibaseService: FirebaseService,
    private readonly storage: AngularFireStorage,
  ) {

  }

  onUpload(e) {
    /* console.log(e.target.files[0]); */
    /* const id = Math.random().toString(36).substring(2); */
    const file = e.target.files[0];
    const filePath = `cars/${file.name}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize(
        () => this.urlImage = ref.getDownloadURL())).subscribe();

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }

  ngOnInit(): void {

    this.authServ.getUserCurrent().subscribe(user => {
      if (user) {
        this.firebaseService.getDoc<Usuario>('Usuarios', user.uid).subscribe(res => {
          this.usuario = res;
        });
      } else {
        console.log("No estas logueado");
      }
    });
    this.idFirebaseUpdate = "";

    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.collection.data.length
    };

    //
    this.vehiculoForm = this.fb.group({
      marca: ['', Validators.required],
      color: ['', Validators.required],
      modelo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', Validators.required],
      existencias: ['', Validators.required],
      url: ['', Validators.required]
    });
    //
    this.fabricanteForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      rsi: ['', Validators.required],
      telefono: ['',],
      web: ['',],
      dirEjecutivo: ['', Validators.required],
    });

    this.fibaseService.getCollections(this.path).subscribe(resp => {
      this.collection.data = resp.map((e: any) => {
        return {
          modelo: e.payload.doc.data().modelo,
          marca: e.payload.doc.data().marca,
          color: e.payload.doc.data().color,
          descripcion: e.payload.doc.data().descripcion,
          precio: e.payload.doc.data().precio,
          existencias: e.payload.doc.data().existencias,
          url: e.payload.doc.data().url,
          idFirebase: e.payload.doc.id
        }
      })
      console.log(this.collection.data);
      
    },
    error => {
      console.error(error);
    }
  )
  }


  pageChanged(event) {
    this.config.currentPage = event;
  }

  eliminar(item: any): void {
    this.fibaseService.deleteDoc(this.path,item.idFirebase)
    this.fibaseService.eliminarAccesorio(item.idFirebase)

/*   this.collection.data.pop(item);
 */};

  guardarVehiculo(url: string) {
    this.vehiculoForm.value.url = url;
    this.fibaseService.createArticulo(this.path, this.vehiculoForm.value).
      then(resp => {
        this.vehiculoForm.reset();
        this.modalService.dismissAll();
        this.urlImage = new Observable;
      })
      .catch(error => {
        console.error(error);

      })
  }

  actualizarVehiculo(url: string) {
    if (this.idFirebaseUpdate != null) {
      this.vehiculoForm.value.url = url;
      console.log(this.path,this.idFirebaseUpdate);
      
      this.fibaseService.updateArticulo(this.path, this.idFirebaseUpdate, this.vehiculoForm.value).then(() => {
        this.vehiculoForm.reset();
        this.modalService.dismissAll();
        this.urlImage = new Observable;
      })
        .catch(error => {
          console.error(error);

        });
    }
  }

  //esto es codigo del modal
  editar(content, item: any) {
    this.updSave = true;
    this.idFirebaseUpdate=item.idFirebase
    
    //llenando formulario con los datos a editar
    this.vehiculoForm.setValue({
      marca: item.marca,
      modelo: item.modelo,
      descripcion: item.descripcion,
      color: item.color,
      precio: item.precio,
      existencias: item.existencias,
      url: item.url
    });
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  nuevo(content) {
    this.updSave = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.vehiculoForm.reset();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
