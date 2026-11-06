import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { VendasComponent } from './pages/vendas/vendas.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: 'clientes/:acao', component: ClientesComponent },
      { path: 'produtos/:acao', component: ProdutosComponent },
      { path: 'vendas/:acao', component: VendasComponent },
      { path: '', pathMatch: 'full', redirectTo: 'vendas/listar' },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', redirectTo: 'home' },
];
