import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Servicios/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm=new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })
    constructor(
      private authServ:AuthService,
      private router : Router
    ) { }
  
    ngOnInit(): void { }
  
    async onLogin(){
      const {email, password} = this.loginForm.value;
      try{
        const user =await this.authServ.login(email,password);
        if(user){
          //redireccion a la pagina de inicio
          this.router.navigate(['crud'])
        }
      }
      catch(error){
        console.log(error);
        
      }    
    }
  
    onGoogleLogin(){
      //to then services
      try{
        this.authServ.loginGoogle();
      }
      catch(error){
        console.log(error);
      }
      
    }
  
  }
  