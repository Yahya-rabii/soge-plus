// add-beneficiary.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from '../../../../models/account.model';
import { Router } from '@angular/router';
import { User } from '../../../../models/user.model';
import { AccountService } from '../../../../services/account.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-add-beneficiary',
  templateUrl: './add-beneficiary.component.html',
  styleUrls: ['./add-beneficiary.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,MatIconModule]
})
export class AddBeneficiaryComponent implements OnInit{

  addBeneficiaryForm: FormGroup;
  beneficiary: User = new User();
  accounts: Account[] = [];
  rib : string = '';


  constructor(private formBuilder: FormBuilder, private router: Router , private accountService: AccountService) {
    this.addBeneficiaryForm = this.formBuilder.group({
      rib: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });
  }
  
  ngOnInit() {
    this.getAccountByHolderId();
  }


  public getAccountByHolderId() {
    this.accountService.getAccountByHolderId().then((data) => {
      console.log(data);
      this.accounts = data.Accounts;
    });
  }


  // Method to handle form submission
  public async Submit() {
    if (this.addBeneficiaryForm.invalid) {
      alert('Please enter valid details');
      return;
    }

    const formData = this.addBeneficiaryForm.value;
    this.rib = formData.rib;


    //call the service to get the account by the holder id
    this.getAccountByHolderId();

    // Call the service to add a beneficiary
    for (let account of this.accounts) {
      this.accountService.addBeneficiary(account.id , this.rib ).then(() => {
        alert('Beneficiary added successfully');
        this.router.navigate(['/myaccount']);
      });

    }
  }

  contactus(){
    this.router.navigate(['/contact']);
  }
}
