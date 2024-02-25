import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { EmailVerifiedGuard } from './common/guard/email-verified.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [EmailVerifiedGuard],
  },
  {
    path: '',
    redirectTo: 'home', // Redirect empty path to 'home'
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
