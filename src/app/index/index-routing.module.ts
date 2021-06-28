import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { IndexGuard } from '../guards/index.guard';
import { IntroGuard } from '../guards/intro.guard';

import { IndexPage } from './index.page';

const routes: Routes = [
  {
    path: '',
    component: IndexPage,
    canActivate: [IndexGuard],
    children: [
       {
      path: '',
      loadChildren: () => 
        import('../pages/login/login.module').then(m => m.LoginPageModule)
      //  canActivate: [IntroGuard]
      }, 
      {
        path: 'intro',
        loadChildren: () =>
          import('../pages/intro/intro.module').then(
            m => m.IntroPageModule
          )
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
      }               
      /* {
          path: '',
          redirectTo: '/login',
          pathMatch: 'full',
          canActivate: [IntroGuard]
      } */
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexPageRoutingModule {}
