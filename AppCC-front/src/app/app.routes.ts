import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth.guard'; // Import your AuthGuard
import { AdminComponent } from './components/admin/admin.component';
import { AboutComponent } from './components/about/about.component';
import { UserstableComponent } from './components/userstable/userstable.component';
import{CreateloanComponent} from './components/loan/createloan/createloan.component';
export const routes: Routes = [
    // '/' accessible only if the user is logged in authService.isLoggedIn()
    { path: '', component: HomeComponent, canActivate: [AuthGuard] }, // Protecting the home route
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    // Add the dashboard route here
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
    { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UserstableComponent,canActivate: [AuthGuard]  } ,
    { path: 'createloan', component: CreateloanComponent,canActivate: [AuthGuard]  }

];

export enum AppRoutes{
    Admin = "admin",
}