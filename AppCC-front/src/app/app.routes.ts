import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth.guard'; // Import your AuthGuard
import { AdminComponent } from './components/admin/admin.component';
import { AboutComponent } from './components/about/about.component';
import { UserstableComponent } from './components/userstable/userstable.component';
import{CreateloanComponent} from './components/loan/createloan/createloan.component';
import { ValidationFormComponent } from './components/loan/validation-form/validation-form.component';
import { PrivacypolicyComponent } from './components/privacypolicy/privacypolicy.component';
import { ContactComponent } from './components/contact/contact.component';
import { DisplayLoanUserComponent } from './components/loan/display-loan-user/display-loan-user.component';
import { ContractsComponent } from './components/admin/views/contracts/contracts.component';    
import { LoansRequestsComponent } from './components/admin/views/loans-requests/loans-requests.component';
import { AdminGuard } from './admin.guard';
import { UserGuard } from './user.guard';
export const routes: Routes = [
    // '/' accessible only if the user is logged in authService.isLoggedIn()
    { path: '', component: HomeComponent, canActivate: [AuthGuard,UserGuard]  }, // Protecting the home route
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    // Add the dashboard route here
    { path: 'admin', component: AdminComponent, canActivate: [AdminGuard]  },
    { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UserstableComponent,canActivate: [AuthGuard]  } ,
    { path: 'loan/createloan', component: CreateloanComponent,canActivate: [AuthGuard]  },
    { path: 'loan/confirmation', component: ValidationFormComponent,canActivate: [AuthGuard]  },
    { path: 'loansRequests', component: LoansRequestsComponent,canActivate: [AdminGuard]  },
    { path: 'privacypolicy', component: PrivacypolicyComponent,canActivate: [AuthGuard]  },
    { path: 'contact', component: ContactComponent,canActivate: [AuthGuard]  },
    { path: 'loan', component: DisplayLoanUserComponent,canActivate: [AuthGuard]  },
    { path: 'contracts', component: ContractsComponent,canActivate: [AuthGuard]  },

];

export enum AppRoutes{
    Admin = "admin",
}