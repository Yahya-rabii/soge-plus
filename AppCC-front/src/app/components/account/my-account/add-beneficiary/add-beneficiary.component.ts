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
  rib: string = ''; // Change the type to string to handle the spaces

  constructor(private formBuilder: FormBuilder, private router: Router , private accountService: AccountService) {
    this.addBeneficiaryForm = this.formBuilder.group({
      // rib is not a string, it is a number of 16 digits
      rib: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]], // Update minimum length to 16
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
    // Fetch accounts first
    this.getAccountByHolderId();

    // remove spaces from the addbeneficiary form rib
    this.addBeneficiaryForm.patchValue({ rib: this.addBeneficiaryForm.value.rib.replace(/\s/g, '') });
    // Check form validity after fetching accounts
    if (this.addBeneficiaryForm.invalid) {
      console.log('Form validity:', this.addBeneficiaryForm.valid); // Add this line
      console.log('Form value:', this.addBeneficiaryForm.value); // Add this line
      alert('Please enter valid details');
      return;
    }
  
    const formData = this.addBeneficiaryForm.value;
    this.rib = formData.rib.replace(/\s/g, ''); // Remove any existing spaces
  
    // Call the service to add a beneficiary
    for (let account of this.accounts) {
      this.accountService.addBeneficiary(account.id , Number(this.rib)).then(() => {
        alert('Beneficiary added successfully');
        this.router.navigate(['/myaccount']);
      });
    }
  }
  
  // Function to add space after every four characters
  public formatRIB(event: any): void {
    let currentValue = event.target.value;
    currentValue = currentValue.replace(/\s/g, ''); // Remove existing spaces
    currentValue = currentValue.replace(/(\d{4})/g, '$1 ').trim(); // Add space after every four characters
    // stop the user to unter more after reachin 16 digits
    if (currentValue.length > 19) {
      currentValue = currentValue.substring(0, 19);
    }

    this.addBeneficiaryForm.patchValue({ rib: currentValue });
    console.log('Formatted RIB:', currentValue);
  }

  contactus(){
    this.router.navigate(['/contact']);
  }
}
