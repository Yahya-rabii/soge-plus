import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { NoAuthGuard } from '../guards/No.auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { UserGuard } from '../guards/user.guard';
import { isEnabledGuard } from '../guards/isEnabled.guard';
import { isNotEnabledGuard } from '../guards/isNotEnabled.guard';
export const routes: Routes = [
  {
    path: 'contact',
    loadComponent: () =>
      import('../components/contact/contact.component').then(
        (m) => m.ContactComponent,
      ),
  },
  {
    path: 'privacypolicy',
    loadComponent: () =>
      import('../components/privacypolicy/privacypolicy.component').then(
        (m) => m.PrivacypolicyComponent,
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('../components/about/about.component').then(
        (m) => m.AboutComponent,
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../components/signup/signup.component').then(
        (m) => m.SignupComponent,
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../components/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('../components/home/home.component').then((m) => m.HomeComponent),
    canActivate: [AuthGuard, UserGuard, isEnabledGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin.routes').then((m) => m.ADMIN_ROUTES),
    canActivate: [AdminGuard, isEnabledGuard],
  },
  {
    path: 'loan',
    loadChildren: () => import('./loan.routes').then((m) => m.LOAN_ROUTES),
    canActivate: [AuthGuard, isEnabledGuard],
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account.routes').then((m) => m.ACCOUNT_ROUTES),
    canActivate: [AuthGuard, UserGuard, isEnabledGuard],
  },
  {
    path: 'mycontracts',
    loadComponent: () =>
      import('../components/mycontracts/my.contracts.component').then(
        (m) => m.MyContractsComponent,
      ),
    canActivate: [AuthGuard, UserGuard, isEnabledGuard],
  },
  {
    path: 'my',
    loadComponent: () =>
      import(
        '../components/mycontracts/validation-contract-secret/validation-contract-secret.component'
      ).then((m) => m.ValidationContractSecretComponent),
    canActivate: [AuthGuard, UserGuard, isEnabledGuard],
  },
  {
    path: 'enable',
    loadComponent: () =>
      import(
        '../components/login/enable_user/enable-user-secret.component'
      ).then((m) => m.EnableAccountComponent),
    canActivate: [AuthGuard, UserGuard, isNotEnabledGuard],
  },
  { path: '**', redirectTo: 'home' },
];
