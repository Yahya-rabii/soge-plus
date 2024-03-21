import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth.guard'; // Import your AuthGuard
import { DashboardComponent } from './components/admin/pages/dashboard/dashboard.component';

export const routes: Routes = [
    // '/' accessible only if the user is logged in authService.isLoggedIn()
    { path: '', component: HomeComponent, canActivate: [AuthGuard] }, // Protecting the home route
    { path: 'admin', component: DashboardComponent, canActivate: [AuthGuard] }, // Protecting the dashboard route
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent }
    //{ path: 'admin', component: AdmindashboardComponent , canActivate: [authGuard] }

];