import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormDataService } from '../../../services/form-data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Loan } from '../../../models/loan.model';
import { LoanService } from '../../../services/loan.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoanImagesDispalyComponent } from './loan-images-dispaly/loan-images-dispaly.component';
import { AuthenticationService } from '../../../services/authentication.service';
@Component({
  selector: 'app-validation-form',
  templateUrl: './validation-form.component.html',
  styleUrls: ['./validation-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ValidationFormComponent implements OnInit {
  formData: FormGroup = new FormGroup({});
  signature: File | undefined;
  idCardFront: File | undefined;
  idCardBack: File | undefined;
  receptionMethod: string | null = null;
  loan: Loan = new Loan();
  image: File | undefined = undefined;
  signatureFileName: string | undefined = undefined;
  idCardFrontFileName: string | undefined = undefined;
  idCardBackFileName: string | undefined = undefined;
  constructor(
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private formDataService: FormDataService,
    private fb: FormBuilder,
    private LoanService: LoanService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.formData = this.formDataService.getFormData();
    this.signature = this.formData.get('signature')?.value;
    this.idCardFront = this.formData.get('idCardFront')?.value;
    this.idCardBack = this.formData.get('idCardBack')?.value;
    this.signatureFileName = this.signature?.name;
    this.idCardFrontFileName = this.idCardFront?.name;
    this.idCardBackFileName = this.idCardBack?.name;
    this.receptionMethod = this.formData.get('receptionMethod')?.value;
    this.updateFormDisplay();
    this.formData.get('receptionMethod')?.valueChanges.subscribe((value) => {
      this.receptionMethod = value;
      this.updateFormDisplay();
    });
    this.formData.get('receptionMethod')?.valueChanges.subscribe((value) => {
      this.receptionMethod = value;
      if (this.receptionMethod === 'ONLINE') {
        const ribSection = document.getElementById('ribSection');
        if (ribSection) {
          ribSection.style.display = 'block';
        }
        const agencySelectionSection = document.getElementById(
          'agencySelectionSection',
        );
        if (agencySelectionSection) {
          agencySelectionSection.style.display = 'none';
        }
      } else if (this.receptionMethod === 'ON_AGENCY') {
        const ribSection = document.getElementById('ribSection');
        if (ribSection) {
          ribSection.style.display = 'none';
        }
        const agencySelectionSection = document.getElementById(
          'agencySelectionSection',
        );
        if (agencySelectionSection) {
          agencySelectionSection.style.display = 'block';
        }
      }
    });
  }
  updateFormDisplay() {
    const ribSection = document.getElementById('ribSection');
    const agencySelectionSection = document.getElementById(
      'agencySelectionSection',
    );
    if (this.receptionMethod === 'ONLINE') {
      if (ribSection) {
        ribSection.style.display = 'block';
      }
      if (agencySelectionSection) {
        agencySelectionSection.style.display = 'none';
      }
    } else if (this.receptionMethod === 'ON_AGENCY') {
      if (ribSection) {
        ribSection.style.display = 'none';
      }
      if (agencySelectionSection) {
        agencySelectionSection.style.display = 'block';
      }
    }
  }
  dialogRef: any;
  openDialog(field: string): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    if (field === 'signature') {
      this.image = this.formData.get('signature')?.value as File;
    } else if (field === 'front-modal') {
      this.image = this.formData.get('idCardFront')?.value as File;
    } else if (field === 'back-modal') {
      this.image = this.formData.get('idCardBack')?.value as File;
    }
    this.dialogRef = this.dialog.open(LoanImagesDispalyComponent, {
      width: '500px',
      data: { image: this.image },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      this.dialogRef = null;
    });
  }
  onFileSelected(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    const file: File | null = (inputElement.files as FileList)[0] || null;
    if (file) {
      if (field === 'signature') {
        console.log('signature:', file);
        this.signature = file;
        this.formData.get('signature')?.setValue(file);
      } else if (field === 'idCardFront') {
        this.idCardFront = file;
        this.formData.get('idCardFront')?.setValue(file);
      } else if (field === 'idCardBack') {
        this.idCardBack = file;
        this.formData.get('idCardBack')?.setValue(file);
      }
    }
  }
  submitForm() {
    if (this.receptionMethod === 'ONLINE') {
      this.formData.get('selectedAgency')?.setValue('');
    } else if (this.receptionMethod === 'ON_AGENCY') {
      this.formData.get('rib')?.setValue('');
    }
    this.loan = new Loan(
      0,
      this.formData.get('loanAmount')?.value,
      this.formData.get('loanType')?.value,
      this.formData.get('paymentDuration')?.value,
      'PENDING',
      false,
      this.formData.get('signature')?.value,
      this.formData.get('idCardFront')?.value,
      this.formData.get('idCardBack')?.value,
      this.formData.get('cinNumber')?.value,
      this.formData.get('taxId')?.value,
      this.formData.get('receptionMethod')?.value,
      this.formData.get('rib')?.value,
      this.formData.get('agency')?.value,
      new Date(),
      this.authService.getUserId(),
    );
    this.LoanService.createLoan(this.loan)
      .then((response) => {
        alert('Loan created successfully');
        this.formDataService.clearFormData();
        this.formData = new FormGroup({});
        this.router.navigate(['/loan/myloans']).then();
      })
      .catch((error) => {
        alert('Error creating Loan');
      });
  }
}
