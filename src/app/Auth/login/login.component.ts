import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })
  constructor(
    private authServ: AuthService,
    private router: Router,
    private firebaseServ: FirebaseService
  ) { }

  ngOnInit(): void { }

  async onLogin() {
    const { email, password } = this.loginForm.value;
    if (email == 'admin' && password == "admin1234") {
      this.firebaseServ.sendObjectSorce(true)
      this.router.navigate(['crud', 'admin'])
    } else {
      try {
        const user = await this.authServ.login(email, password);
        if (user) {
          //redireccion a la pagina de inicio
          this.router.navigate(['presentacion'])
        }
      }
      catch (error) {
        console.log(error);

      }
    }
  }

  onGoogleLogin() {
    //to then services
    try {
      this.authServ.loginGoogle();
    }
    catch (error) {
      console.log(error);
    }

  }

}
