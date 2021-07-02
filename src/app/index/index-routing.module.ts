import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { IndexGuard } from '../guards/index.guard';

import { IndexPage } from './index.page';

const routes: Routes = [
  {
    path: '',
    component: IndexPage,
    canActivate: [IndexGuard],
    children: [
      /* {
        path: 'intro',
        loadChildren: () =>
          import('../pages/intro/intro.module').then(
            m => m.IntroPageModule
          )
      }, */
      {
        path: 'welcome',
        loadChildren: () => import('../pages/welcome/welcome.module').then( m => m.WelcomePageModule)
      },
      {
        path: 'login',
        loadChildren: () => 
          import('../pages/login/login.module').then(m => m.LoginPageModule),
          
      },
      {
        path: 'register',
        loadChildren: () => 
          import('../pages/register/register.module').then(m => m.RegisterPageModule)
      },
      {
        path:'reset-password',
        loadChildren: () =>
          import('../pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
      } ,              
       {
          path: '',
          redirectTo: '/welcome',
          pathMatch: 'full'
      } 
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexPageRoutingModule {}
