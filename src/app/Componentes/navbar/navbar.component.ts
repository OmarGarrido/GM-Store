import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/Servicios/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public user$:Observable<any>=this.authServ.afServ.user;

  constructor(
    private authServ:AuthService,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  async onLogout(){
    try{
      await this.authServ.logout();
      this.router.navigate(['login']);
    }
    catch(error){
      console.log(error);
    }
    
  }

}
