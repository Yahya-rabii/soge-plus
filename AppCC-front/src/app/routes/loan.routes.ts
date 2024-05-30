import { Routes } from '@angular/router';
import { CreateloanComponent } from '../components/loan/createloan/createloan.component';
import { ValidationFormComponent } from '../components/loan/validation-form/validation-form.component';
import { MyLoansComponent } from '../components/loan/my-loans/my-loans.component';
export const LOAN_ROUTES: Routes = [
  { path: 'createloan', component: CreateloanComponent },
  { path: 'confirmation', component: ValidationFormComponent },
  { path: 'myloans', component: MyLoansComponent },
];
