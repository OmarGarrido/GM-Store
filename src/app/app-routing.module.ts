import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { CrudComponent } from './Componentes/crud/crud.component';
import { DetallesComponent } from './Componentes/detalles/detalles.component';
import { FabricanteComponent } from './Componentes/fabricante/fabricante.component';
import { HomeComponent } from './Componentes/home/home.component';
import { PagosComponent } from './Componentes/pagos/pagos.component';
import { PedidosComponent } from './Componentes/pedidos/pedidos.component';
import { PoliticasComponent } from './Componentes/politicas/politicas.component';
import { PresentacionComponent } from './Componentes/presentacion/presentacion.component';
import { VehiculosComponent } from './Componentes/vehiculos/vehiculos.component';

const routes: Routes = [
  { path: 'Inicio', component: HomeComponent },
  { path: 'presentacion', component: PresentacionComponent },
  { path: 'Politicas', component: PoliticasComponent },
  { path: 'Pedidos', component: PedidosComponent },
  { path: 'crud', component: CrudComponent },
  { path: 'vehiculos', component: VehiculosComponent },
  { path: 'fabricantes', component: FabricanteComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'Pagos', component: PagosComponent },
  { path: 'detalles/:smart', component: DetallesComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'presentacion' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
