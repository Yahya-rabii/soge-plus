import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from '../../../../models/account.model';
import { Router } from '@angular/router';
import { User } from '../../../../models/user.model';
import { AccountService } from '../../../../services/account.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../../../services/user.service';
@Component({
  selector: 'app-add-beneficiary',
  templateUrl: './add-beneficiary.component.html',
  styleUrls: ['./add-beneficiary.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
})
export class AddBeneficiaryComponent implements OnInit {
  addBeneficiaryForm: FormGroup;
  beneficiary: User = new User();
  account: Account = new Account();
  rib: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private userService: UsersService
  ) {
    this.addBeneficiaryForm = this.formBuilder.group({
      rib: [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
        ],
      ],
      name: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.getAccountByHolderId();
  }

  public getAccountByHolderId() {
    this.accountService.getAccountByHolderId().then((data) => {
      console.log(data);
      this.account = data.Account;
    });
  }

  public async Submit() {
    this.getAccountByHolderId();
    this.addBeneficiaryForm.patchValue({
      rib: this.addBeneficiaryForm.value.rib.replace(/\s/g, ''),
    });
    if (this.addBeneficiaryForm.invalid) {
      console.log('Form validity:', this.addBeneficiaryForm.valid);
      console.log('Form value:', this.addBeneficiaryForm.value);
      alert('Please enter valid details');
      return;
    }
    const formData = this.addBeneficiaryForm.value;
    this.rib = formData.rib.replace(/\s/g, '');
    let ifExist = false;
    this.account.beneficiariesIds.forEach((clientID) => {

      const Client = this.userService.getUserById(clientID).then((data) => {
      const rib : string = data.rib.toString();
      console.log('rib ==== this.rib', rib+"===="+this.rib);
      if (rib == this.rib) {
        ifExist = true;
        console.log('exist:', ifExist);
        alert('Beneficiary already exists');
      }
    });
    });
    if(this.account.accountHolderRib == this.rib){
      alert('You cannot add yourself as a beneficiary');
    }

    if (this.account.accountHolderRib != this.rib && ifExist === false) {
      this.accountService
        .addBeneficiary(this.account.id, Number(this.rib))
        .then(() => {
          alert('Beneficiary added successfully');
          this.router.navigate(['/account/myaccount']).then();
        });
    }
  }

  public formatRIB(event: any): void {
    let currentValue = event.target.value;
    currentValue = currentValue.replace(/\s/g, '');
    currentValue = currentValue.replace(/(\d{4})/g, '$1 ').trim();
    if (currentValue.length > 19) {
      currentValue = currentValue.substring(0, 19);
    }
    this.addBeneficiaryForm.patchValue({ rib: currentValue });
    console.log('Formatted RIB:', currentValue);
  }
  contactus() {
    this.router.navigate(['/contact']).then();
  }
}
