import { Routes } from '@angular/router';
import { CreateAccountComponent } from '../components/account/create-account/create-account.component';
import { MyAccountComponent } from '../components/account/my-account/my-account.component';
import { AddTransactionComponent } from '../components/account/my-account/add-transaction/add-transaction.component';
import { AddBeneficiaryComponent } from '../components/account/my-account/add-beneficiary/add-beneficiary.component';
import { TransactionsComponent } from '../components/account/my-account/transactions/transactions.component';
import { AccountGuard } from '../guards/account.guard';
export const ACCOUNT_ROUTES: Routes = [
  { path: 'create-account', component: CreateAccountComponent },
  {
    path: 'myaccount',
    component: MyAccountComponent,
    canActivate: [AccountGuard],
  },
  {
    path: 'add-transaction',
    component: AddTransactionComponent,
    canActivate: [AccountGuard],
  },
  {
    path: 'add-beneficiary',
    component: AddBeneficiaryComponent,
    canActivate: [AccountGuard],
  },
  {
    path: 'my-transactions',
    component: TransactionsComponent,
    canActivate: [AccountGuard],
  },
];
