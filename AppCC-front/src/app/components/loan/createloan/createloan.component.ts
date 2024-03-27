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
  imports: [ CommonModule , ReactiveFormsModule ]
})
export class CreateloanComponent {

  createLoanForm: FormGroup;
  currentSection: number = 1;
  imageUrl: string | ArrayBuffer | null = null;
  signature: string | null = null;
  idCardFront: string | null = null;
  idCardBack: string | null = null;
  loanAmount: number = 0;
  loanType: string | null = null;
  paymentDuration: number = 0;
  cinNumber: string | null = null;
  taxId: string | null = null;
  receptionMethod: string | null = null;
  rib: string | null = null;
  agency: string | null = null;

  constructor(private formBuilder: FormBuilder, private router: Router, private formDataService: FormDataService) {
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
      agency: ['']
    });
  }

  onFileSelected(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    const file: File | null = (inputElement.files as FileList)[0] || null;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (field === 'signature') {
          this.signature = reader.result as string;
        } else if (field === 'idCardFront') {
          this.idCardFront = reader.result as string;
        } else if (field === 'idCardBack') {
          this.idCardBack = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  public NextSection() {
    // Handle progression of the progress bar
    const progressBarSteps = document.querySelectorAll('.progress-bar-step');
    const currentStep = this.currentSection;
    progressBarSteps.forEach((step, index) => {
      if (index === currentStep - 1) { // Adjust index to match zero-based index
        if (this.currentSection === index + 1) {
          step.classList.remove('border-gray-300');
          step.classList.add('border-red-600');
        }
      } else {
        step.classList.remove('border-red-600');
        step.classList.add('border-gray-300');
      }
    });

    if (this.currentSection === 1) {
      // Validate loan information fields
      this.loanAmount = this.createLoanForm.get('loanAmount')?.value;
      this.loanType = this.createLoanForm.get('loanType')?.value;
      this.paymentDuration = this.createLoanForm.get('paymentDuration')?.value;

      if (this.loanAmount && this.loanType && this.paymentDuration) {
        this.currentSection = 2;
        const loanInfoSection = document.getElementById('loanInfoSection');
        if (loanInfoSection) {
          loanInfoSection.style.display = 'none';
        }
        const signatureSection = document.getElementById('signatureSection');
        if (signatureSection) {
          signatureSection.style.display = 'block';
        }
      } else {
        alert('Please fill all fields in this section');
      }
    } else if (this.currentSection === 2) {
      // Validate signature field
      if (this.signature) {
        this.currentSection = 3;
        const signatureSection = document.getElementById('signatureSection');
        const idCardSection = document.getElementById('idCardSection');
        if (signatureSection) {
          signatureSection.style.display = 'none';
        }
        if (idCardSection) {
          idCardSection.style.display = 'block';
        }
      } else {
        alert('Please upload your signature');
      }
    } else if (this.currentSection === 3) {
      // Validate ID card images
      if (this.idCardFront && this.idCardBack) {
        this.currentSection = 4;
        const idCardSection = document.getElementById('idCardSection');
        const additionalInfoSection = document.getElementById('additionalInfoSection');
        if (idCardSection) {
          idCardSection.style.display = 'none';
        }
        if (additionalInfoSection) {
          additionalInfoSection.style.display = 'block';
        }
      } else {
        alert('Please upload both sides of your ID card');
      }
    } else if (this.currentSection === 4) {
      // Validate additional information fields
      this.cinNumber = this.createLoanForm.get('cinNumber')?.value as string;
      this.taxId = this.createLoanForm.get('taxId')?.value as string;
      if (this.cinNumber && this.cinNumber.length > 0 && this.taxId && this.taxId.length > 0) {
        this.receptionMethod = this.createLoanForm.get('receptionMethod')?.value as string;
        if (this.receptionMethod === 'ONLINE') {
          // If online method selected, proceed to the RIB section
          this.currentSection = 6;
          const additionalInfoSection = document.getElementById('additionalInfoSection');
          const ribSection = document.getElementById('ribSection');
          if (additionalInfoSection) {
            additionalInfoSection.style.display = 'none';
          }
          if (ribSection) {
            ribSection.style.display = 'block';
          }
        } else {
          // If on agency method selected, proceed to the agency selection section
          this.currentSection = 7;
          const additionalInfoSection = document.getElementById('additionalInfoSection');
          const agencySelectionSection = document.getElementById('agencySelectionSection');
          if (additionalInfoSection) {
            additionalInfoSection.style.display = 'none';
          }
          if (agencySelectionSection) {
            agencySelectionSection.style.display = 'block';
          }
        }
      } else {
        alert('Please fill the CIN Number field');
      }
    } else if (this.currentSection === 5) {
      // Validate reception method selection
      this.receptionMethod = this.createLoanForm.get('receptionMethod')?.value as string;
      if (this.receptionMethod) {
        if (this.receptionMethod === 'ONLINE') {
          // If online method selected, proceed to the RIB section
          this.currentSection = 6;
          const receptionMethodSection = document.getElementById('receptionMethodSection');
          const ribSection = document.getElementById('ribSection');
          if (receptionMethodSection) {
            receptionMethodSection.style.display = 'none';
          }
          if (ribSection) {
            ribSection.style.display = 'block';
          }
        } else if (this.receptionMethod === 'ON_AGENCY') {
          // If on agency method selected, proceed to the agency selection section
          this.currentSection = 7;
          const receptionMethodSection = document.getElementById('receptionMethodSection');
          const agencySelectionSection = document.getElementById('agencySelectionSection');
          if (receptionMethodSection) {
            receptionMethodSection.style.display = 'none';
          }
          if (agencySelectionSection) {
            agencySelectionSection.style.display = 'block';
          }
        }
      } else {
        alert('Please select a reception method');
      }
    } else if (this.currentSection === 6) {
      // If the current section is the RIB section
      this.rib = this.createLoanForm.get('rib')?.value as string;
      console.log('RIB: ', this.rib);
      if (this.rib) {
        // If RIB is valid, proceed to the form submission
        this.currentSection = 7;
        this.Submit();
      } else {
        alert('Please enter your RIB');
      }
    } else if (this.currentSection === 7) {
      // If the current section is the agency selection section
      this.agency = this.createLoanForm.get('agency')?.value as string;
      // Proceed to form submission
      this.currentSection = 8;
      this.Submit();
    }
  }

  Submit() {
    
    // Build the form data object from the variables, not from the form and send it to the service setFormData method which takes a FormGroup

    // Build the form data object from the variables
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
      agency: [this.agency]
    });

    // Send the form data object to the service setFormData method
    this.formDataService.setFormData(formData);

    console.log('Form data in the parent: ', formData);
   
    // Navigate to the confirmation form
    this.router.navigate(['/loan/confirmation']);
  }
}