import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormDataService } from '../../../services/form-data.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-createloan',
  templateUrl: './createloan.component.html',
  styleUrls: ['./createloan.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateloanComponent {
  createLoanForm: FormGroup;
  currentSection: number = 1;
  sectionFilled: boolean[] = [false, false, false, false, false];
  imageUrl: string | ArrayBuffer | null = null;
  signature: File | null = null;
  idCardFront: File | null = null;
  idCardBack: File | null = null;
  loanAmount: number = 0;
  loanType: string | null = null;
  paymentDuration: number = 0;
  cinNumber: string | null = null;
  taxId: string | null = null;
  receptionMethod: string | null = null;
  rib: string | null = null;
  agency: string | null = null;
  signatureFileName: string | null = null;
  idCardFrontFileName: string | null = null;
  idCardBackFileName: string | null = null;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private formDataService: FormDataService,
  ) {
    this.createLoanForm = this.formBuilder.group({
      loanAmount: ['', [Validators.required]],
      loanType: ['', [Validators.required]],
      paymentDuration: ['', [Validators.required]],
      signature: [''],
      idCardFront: [''],
      idCardBack: [''],
      cinNumber: ['', [Validators.required]],
      taxId: ['', [Validators.required]],
      receptionMethod: ['', [Validators.required]],
      rib: [''],
      agency: [''],
    });
  }
  onChooseFile(field: string): void {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.jpg,.jpeg,.png,.pdf';
    inputElement.onchange = (event: Event) => {
      const file: File | null =
        (event.target as HTMLInputElement).files?.[0] || null;
      if (file) {
        if (field === 'signature') {
          this.signature = file;
          this.signatureFileName = file.name;
          this.createLoanForm.controls['signature'].setValue(file);
        } else if (field === 'idCardFront') {
          this.idCardFront = file;
          this.idCardFrontFileName = file.name;
          this.createLoanForm.controls['idCardFront'].setValue(file);
        } else if (field === 'idCardBack') {
          this.idCardBack = file;
          this.idCardBackFileName = file.name;
          this.createLoanForm.controls['idCardBack'].setValue(file);
        }
      }
    };
    inputElement.click();
  }
  getSignatureFileName(): string {
    return this.signatureFileName || 'Choose file';
  }
  getIdCardFrontFileName(): string {
    return this.idCardFrontFileName || 'Choose file';
  }
  getIdCardBackFileName(): string {
    return this.idCardBackFileName || 'Choose file';
  }
  public GoToSection(section: number) {
    if (section <= this.currentSection) {
      this.currentSection = section;
    }
  }
  public NextSection() {
    if (this.currentSection === 1) {
      this.loanAmount = this.createLoanForm.get('loanAmount')?.value;
      this.loanType = this.createLoanForm.get('loanType')?.value;
      this.paymentDuration = this.createLoanForm.get('paymentDuration')?.value;
      if (this.loanAmount && this.loanType && this.paymentDuration) {
        this.sectionFilled[0] = true;
        this.currentSection = 2;
      } else {
        alert('Please fill all fields in this section');
      }
    } else if (this.currentSection === 2) {
      if (this.signature) {
        this.sectionFilled[1] = true;
        this.currentSection = 3;
      } else {
        alert('Please upload your signature');
      }
    } else if (this.currentSection === 3) {
      if (this.idCardFront && this.idCardBack) {
        this.sectionFilled[2] = true;
        this.currentSection = 4;
      } else {
        alert('Please upload both sides of your ID card');
      }
    } else if (this.currentSection === 4) {
      this.cinNumber = this.createLoanForm.get('cinNumber')?.value as string;
      this.taxId = this.createLoanForm.get('taxId')?.value as string;
      if (
        this.cinNumber &&
        this.cinNumber.length > 0 &&
        this.taxId &&
        this.taxId.length > 0
      ) {
        this.sectionFilled[3] = true;
        this.receptionMethod = this.createLoanForm.get('receptionMethod')
          ?.value as string;
        if (this.receptionMethod === 'ONLINE') {
          this.currentSection = 5;
        } else {
          this.currentSection = 6;
        }
      } else {
        alert('Please fill the CIN Number field');
      }
    } else if (this.currentSection === 5) {
      this.rib = this.createLoanForm.get('rib')?.value as string;
      if (this.rib) {
        this.sectionFilled[4] = true;
        this.currentSection = 6;
        this.Submit();
      } else {
        alert('Please enter your RIB');
      }
    } else if (this.currentSection === 6) {
      this.agency = this.createLoanForm.get('agency')?.value as string;
      this.currentSection = 7;
      this.Submit();
    }
  }
  Submit() {
    const formData = this.formBuilder.group({
      loanAmount: [this.loanAmount, [Validators.required]],
      loanType: [this.loanType, [Validators.required]],
      paymentDuration: [this.paymentDuration, [Validators.required]],
      signature: [this.signature],
      idCardFront: [this.idCardFront],
      idCardBack: [this.idCardBack],
      cinNumber: [this.cinNumber, [Validators.required]],
      taxId: [this.taxId, [Validators.required]],
      receptionMethod: [this.receptionMethod, [Validators.required]],
      rib: [this.rib],
      agency: [this.agency],
    });
    this.formDataService.setFormData(formData);
    this.router.navigate(['/loan/confirmation']).then();
  }
}
