import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AyudaComponent } from './Componentes/ayuda/ayuda.component';
import { CrudComponent } from './Componentes/crud/crud.component';
import { DetallesComponent } from './Componentes/detalles/detalles.component';
import { HomeComponent } from './Componentes/home/home.component';
import { PagosComponent } from './Componentes/pagos/pagos.component';
import { PoliticasComponent } from './Componentes/politicas/politicas.component';

const routes: Routes = [
  { path: 'Inicio', component: HomeComponent },
  { path: 'Politicas', component: PoliticasComponent },
  { path: 'Ayuda', component: AyudaComponent },
  { path: 'Pagos', component: PagosComponent },
  {path:'detalles/:smart',component:DetallesComponent},
  // { path: 'Compras', component: ComprasComponent },
  { path: 'crud', component: CrudComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'Inicio' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
