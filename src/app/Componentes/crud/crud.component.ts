import { Component, OnInit } from '@angular/core';
import { AngularFireStorage} from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, pipe, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  collection = { data: [] }
  SmartphoneForm: FormGroup;
  idFirebaseUpdate: string;
  updSave: boolean;
  config: any
  closeResult = "";

  //
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  urlFInd: Subscription;

  constructor(
    public fb: FormBuilder,
    private modalService: NgbModal,
    private fibaseService: FirebaseService,
    private readonly storage: AngularFireStorage) { }

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
    this.idFirebaseUpdate = "";

    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.collection.data.length
    };

    this.SmartphoneForm = this.fb.group({
      marca: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', Validators.required],
      procesador: ['', Validators.required],
      camara: ['', Validators.required],
      almacenamiento: ['', Validators.required],
      calificacion: ['', Validators.required],
      url: ['', Validators.required]
    });

    this.fibaseService.getSmartphone().subscribe(
      resp => {
        this.collection.data = resp.map((e: any) => {
          return {
            marca: e.payload.doc.data().marca,
            descripcion: e.payload.doc.data().descripcion,
            precio: e.payload.doc.data().precio,
            procesador: e.payload.doc.data().procesador,
            camara: e.payload.doc.data().camara,
            almacenamiento: e.payload.doc.data().almacenamiento,
            calificacion: e.payload.doc.data().calificacion,
            url:e.payload.doc.data().url,
            idFirebase: e.payload.doc.id
          }
        })
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
/*   this.collection.data.pop(item);
 */};

  guardar(url: string) {
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

  };

  actualizar(url: string) {
    //!isNullOrUndefined(this.idFirebaseUpdate)
    if (this.idFirebaseUpdate != null) {
      this.SmartphoneForm.value.url = url;
      this.fibaseService.updateSmartphone(this.idFirebaseUpdate, this.SmartphoneForm.value).then(resp => {
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
  editarMaterial(content, item: any) {
    this.updSave = true;
    //llenando formulario con los datos a editar
    this.SmartphoneForm.setValue({
      marca: item.marca,
      descripcion: item.descripcion,
      precio: item.precio,
      procesador: item.procesador,
      camara: item.camara,
      almacenamiento: item.almacenamiento,
      calificacion: item.calificacion,
      url: item.url
    });
    this.idFirebaseUpdate =item.idFirebase;
    console.log(this.idFirebaseUpdate)    //**//
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  nuevoMaterial(content) {
    this.updSave = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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