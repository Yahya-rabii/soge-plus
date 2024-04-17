import { Routes } from '@angular/router';
import { SignupComponent } from '../components/signup/signup.component';
import { LoginComponent } from '../components/login/login.component';
import { HomeComponent } from '../components/home/home.component';
import { AuthGuard } from '../guards/auth.guard'; // Import your AuthGuard
import { AboutComponent } from '../components/about/about.component';
import { UserstableComponent } from '../components/userstable/userstable.component';
import{CreateloanComponent} from '../components/loan/createloan/createloan.component';
import { ValidationFormComponent } from '../components/loan/validation-form/validation-form.component';
import { PrivacypolicyComponent } from '../components/privacypolicy/privacypolicy.component';
import { ContactComponent } from '../components/contact/contact.component';
import { ContractsComponent } from '../components/admin/contracts/contracts.component';    
import { LoansRequestsComponent } from '../components/admin/loans-requests/users/users-loans-requests.component';
import { AdminGuard } from '../guards/admin.guard';
import { UserGuard } from '../guards/user.guard';
import { DashboardComponent } from '../components/admin/dashboard/dashboard.component';
import { MyLoansComponent } from '../components/loan/my-loans/my-loans.component';
import { LoansOfUserComponent } from '../components/admin/loans-requests/loans-of-user/loans-of-user.component';
import { NoAuthGuard } from '../guards/No.auth.guard';
export const routes: Routes = [
    // '/' accessible only if the user is logged in authService.isLoggedIn()
    { path: 'contact', component: ContactComponent  },
    { path: 'privacypolicy', component: PrivacypolicyComponent  },
    { path: 'about', component: AboutComponent },
   
    { path: 'signup', component: SignupComponent , canActivate: [NoAuthGuard] },
    { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard,UserGuard] }, // Protecting the home route
    { path: 'admin', component:DashboardComponent, canActivate: [AdminGuard,AdminGuard]  },
    
    { path: 'users', component: UserstableComponent,canActivate: [AuthGuard,AdminGuard]  } ,
    { path: 'loan/createloan', component: CreateloanComponent,canActivate: [AuthGuard]  },
    { path: 'loan/confirmation', component: ValidationFormComponent,canActivate: [AuthGuard]  },
    { path: 'myloans', component: MyLoansComponent,canActivate: [AuthGuard,UserGuard]  },
    { path: 'loansRequests', component: LoansRequestsComponent,canActivate: [AdminGuard]  },
    { path: 'contracts', component: ContractsComponent,canActivate: [AuthGuard ,AdminGuard]  },
    { path: 'loans-of-user', component: LoansOfUserComponent,canActivate: [AuthGuard,AdminGuard]  },
    { path: '**', redirectTo: 'home' }
];

export enum AppRoutes{
    Admin = "admin",
}