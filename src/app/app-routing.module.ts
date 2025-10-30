import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { HomeComponent } from './features/home/home.component';
import { EditorComponent } from './features/editor/editor.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'register', component: AuthComponent },
  { path: 'home', component: HomeComponent },
  { path: 'editor', component: EditorComponent, canActivate: [AuthGuard] },
  { path: 'editor/:slug', component: EditorComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: '**', component: NotFoundComponent } // Uncomment and create NotFoundComponent if needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }