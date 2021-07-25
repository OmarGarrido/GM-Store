import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, pipe, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Usuario } from 'src/app/models';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  public user$: Observable<any> = this.authServ.afServ.user;
  collection = { data: [] }
  collection2 = { data: [] }
  array: any
  SmartphoneForm: FormGroup;
  accesorioForm: FormGroup;
  idFirebaseUpdate: string;
  updSave: boolean;

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
    private router: Router,
    ) {

  }

  onUpload(e) {
    /* console.log(e.target.files[0]); */
    /* const id = Math.random().toString(36).substring(2); */
    const file = e.target.files[0];
    const filePath = `img/${file.name}`;
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
        this.firebaseService.getDoc<Usuario>('Usuarios',user.uid).subscribe(res=>{
          this.usuario = res;
          console.log(this.usuario.rol);
          
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
    this.accesorioForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', Validators.required],
      existencias: ['', Validators.required],
      etiqueta: ['', Validators.required],
      calificacion: ['', Validators.required],
      url: ['', Validators.required]
    });
    //
    this.SmartphoneForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      descripcion: ['', Validators.required],
      procesador: ['', Validators.required],
      camara: ['', Validators.required],
      almacenamiento: ['', Validators.required],
      precio: ['', Validators.required],
      existencias: ['', Validators.required],
      etiqueta: ['', Validators.required],
      calificacion: ['', Validators.required],
      url: ['', Validators.required]
    });

    this.fibaseService.getSmartphone().subscribe(
      resp => {
        this.collection.data = resp.map((e: any) => {
          return {
            marca: e.payload.doc.data().marca,
            modelo: e.payload.doc.data().modelo,
            colores: e.payload.doc.data().colores,
            descripcion: e.payload.doc.data().descripcion,
            procesador: e.payload.doc.data().procesador,
            camara: e.payload.doc.data().camara,
            almacenamiento: e.payload.doc.data().almacenamiento,
            precio: e.payload.doc.data().precio,
            existencias: e.payload.doc.data().existencias,
            etiqueta: e.payload.doc.data().etiqueta,
            calificacion: e.payload.doc.data().calificacion,
            url: e.payload.doc.data().url,
            idFirebase: e.payload.doc.id
          }
        })
        // console.log(this.collection.data);
      },
      error => {
        console.error(error);
      }
    );

    //
    this.fibaseService.getAccesorios().subscribe(
      resp => {
        this.collection2.data = resp.map((e: any) => {
          return {
            marca: e.payload.doc.data().marca,
            modelo: e.payload.doc.data().modelo,
            colores: e.payload.doc.data().colores,
            descripcion: e.payload.doc.data().descripcion,
            precio: e.payload.doc.data().precio,
            existencias: e.payload.doc.data().existencias,
            etiqueta: e.payload.doc.data().etiqueta,
            calificacion: e.payload.doc.data().calificacion,
            url: e.payload.doc.data().url,
            idFirebase: e.payload.doc.id
          }
        }
        )
        this.array = this.collection.data.concat(this.collection2.data)
        // console.log(this.array);
        console.log(this.collection2.data);
        

      },
      error => {
        console.error(error);
      }

    );



  }


  pageChanged(event) {
    this.config.currentPage = event;
  }

  eliminar(item: any): void {
    this.fibaseService.eliminarSmartphone(item.idFirebase)
    this.fibaseService.eliminarAccesorio(item.idFirebase)
    
/*   this.collection.data.pop(item);
 */};

  guardarAccesorio(url: string) {
    this.accesorioForm.value.url = url;
    this.fibaseService.createArticulo("Accesorios", this.accesorioForm.value).
      then(resp => {
        this.accesorioForm.reset();
        this.modalService.dismissAll();
        this.urlImage = new Observable;
      })
      .catch(error => {
        console.error(error);

      })
  }

  guardarSmartphone(url: string) {
    this.SmartphoneForm.value.url = url;
    this.fibaseService.createSmartphone(this.SmartphoneForm.value).
      then(resp => {
        this.SmartphoneForm.reset();
        this.modalService.dismissAll();
        this.urlImage = new Observable;
      })
      .catch(error => {
        console.error(error);

      })

  }

  actualizarAccesorio(url: string) {
    if (this.idFirebaseUpdate != null) {
      this.accesorioForm.value.url = url;
      this.fibaseService.updateArticulo("Accesorios", this.idFirebaseUpdate, this.accesorioForm.value).then(resp => {
        this.accesorioForm.reset();
        this.modalService.dismissAll();
        this.urlImage = new Observable;
      })
        .catch(error => {
          console.error(error);

        });
    }
  }

  actualizarSmartphone(url: string) {
    //!isNullOrUndefined(this.idFirebaseUpdate)
    if (this.idFirebaseUpdate != null) {
      this.SmartphoneForm.value.url = url;
      this.fibaseService.updateArticulo("Smartphone2", this.idFirebaseUpdate, this.SmartphoneForm.value).then(resp => {
        this.SmartphoneForm.reset();
        this.modalService.dismissAll();
        this.urlImage = new Observable;
      })
        .catch(error => {
          console.error(error);

        });
    }
  }


  //esto es codigo del modal
  editar(content, content2, item: any) {
    this.updSave = true;
    if (item.etiqueta == "Smartphone") {
      //llenando formulario con los datos a editar
      this.SmartphoneForm.setValue({
        marca: item.marca,
        modelo: item.modelo,
        descripcion: item.descripcion,
        procesador: item.procesador,
        camara: item.camara,
        almacenamiento: item.almacenamiento,
        precio: item.precio,
        existencias: item.existencias,
        etiqueta: item.etiqueta,
        calificacion: item.calificacion,
        url: item.url
      });

      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {
      this.accesorioForm.setValue({
        marca: item.marca,
        modelo: item.modelo,
        descripcion: item.descripcion,
        precio: item.precio,
        existencias: item.existencias,
        etiqueta: item.etiqueta,
        calificacion: item.calificacion,
        url: item.url
      });
      //**//
      this.modalService.open(content2, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    this.idFirebaseUpdate = item.idFirebase;
    console.log(this.idFirebaseUpdate)
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
      this.SmartphoneForm.reset();
      this.accesorioForm.reset();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}