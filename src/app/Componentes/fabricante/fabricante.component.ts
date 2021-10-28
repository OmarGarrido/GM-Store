import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Usuario } from 'src/app/models';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';


@Component({
  selector: 'app-fabricante',
  templateUrl: './fabricante.component.html',
  styleUrls: ['./fabricante.component.css']
})
export class FabricanteComponent implements OnInit {
  public user$: Observable<any> = this.authServ.afServ.user;
  collection = { data: [] }

  fabricanteForm: FormGroup;
  idFirebaseUpdate: string;
  updSave: boolean;
  path: string = "Fabricantes/"

  //interfaces
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
          nombre: e.payload.doc.data().nombre,
          direccion: e.payload.doc.data().direccion,
          rsi: e.payload.doc.data().rsi,
          telefono: e.payload.doc.data().telefono,
          web: e.payload.doc.data().web,
          dirEjecutivo: e.payload.doc.data().dirEjecutivo,
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

  guardarVehiculo() {
    this.fibaseService.createArticulo(this.path, this.fabricanteForm.value).
      then(resp => {
        this.fabricanteForm.reset();
        this.modalService.dismissAll();
        this.urlImage = new Observable;
      })
      .catch(error => {
        console.error(error);

      })
  }

  actualizarVehiculo() {
    if (this.idFirebaseUpdate != null) {
      console.log(this.path,this.idFirebaseUpdate);
      
      this.fibaseService.updateArticulo(this.path, this.idFirebaseUpdate, this.fabricanteForm.value).then(() => {
        this.fabricanteForm.reset();
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
    this.fabricanteForm.setValue({
      nombre: item.nombre,
      direccion: item.direccion,
      rsi: item.rsi,
      telefono: item.telefono,
      web: item.web,
      dirEjecutivo: item.dirEjecutivo,
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
      this.fabricanteForm.reset();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
