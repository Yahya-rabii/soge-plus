import { Routes } from '@angular/router';
import { DashboardComponent } from '../components/admin/dashboard/dashboard.component';
import { UserstableComponent } from '../components/admin/userstable/userstable.component';
import { ContractsComponent } from '../components/admin/contracts/contracts.component';
import { LoansRequestsComponent } from '../components/admin/loans-requests/users/users-loans-requests.component';
import { LoansOfUserComponent } from '../components/admin/loans-requests/loans-of-user/loans-of-user.component';
export const ADMIN_ROUTES: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UserstableComponent },
  { path: 'contracts', component: ContractsComponent },
  { path: 'loans-requests', component: LoansRequestsComponent },
  { path: 'loans-of-user', component: LoansOfUserComponent },
];
