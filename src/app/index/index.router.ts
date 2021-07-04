import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPage } from './index.page';
import { IndexGuard } from '../guards/index.guard';

const routes: Routes = [
{
    path: '',
    component: IndexPage,
    canActivate: [IndexGuard],
    children: [
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
exports: [RouterModule]
})
export class IndexRouter {}
