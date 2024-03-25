import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormDataService } from '../../../services/form-data.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-createloan',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './createloan.component.html',
  styleUrl: './createloan.component.css'
})

export class CreateloanComponent {

  signupForm: FormGroup;
  user: User = new User();
  currentSection: number = 1; // Track current section of the form

  

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router , private formDataService: FormDataService) {
    this.signupForm = this.formBuilder.group({
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
  imageUrl: string | ArrayBuffer | null = null;

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file: File | null = (inputElement.files as FileList)[0] || null;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
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
      const loanAmountControl = this.signupForm.get('loanAmount');
      const loanTypeControl = this.signupForm.get('loanType');
      const paymentDurationControl = this.signupForm.get('paymentDuration');
  
      if (loanAmountControl && loanTypeControl && paymentDurationControl &&
          loanAmountControl.valid && loanTypeControl.valid && paymentDurationControl.valid) {
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
      if (this.signupForm.get('signature')?.valid) {
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
      if (this.signupForm.get('idCardFront')?.valid && this.signupForm.get('idCardBack')?.valid) {
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
      const cinNumberControl = this.signupForm.get('cinNumber');
      if (cinNumberControl && cinNumberControl.valid) {
        const receptionMethodControl = this.signupForm.get('receptionMethod');
        if (receptionMethodControl && receptionMethodControl.value === 'ONLINE') {
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
      const receptionMethodControl = this.signupForm.get('receptionMethod');
      if (receptionMethodControl && receptionMethodControl.valid) {
        const selectedMethod = receptionMethodControl.value;
        if (selectedMethod === 'ONLINE') {
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
        } else if (selectedMethod === 'ON_AGENCY') {
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
          const ribControl = this.signupForm.get('rib');
          if (ribControl && ribControl.valid) {
          // If RIB is valid, proceed to the form submission
          this.currentSection = 7;
          this.Submit();
          } else {
          alert('Please enter your RIB');
          }
          } else if (this.currentSection === 7) {
          // If the current section is the agency selection section
          // Proceed to form submission
          this.currentSection = 8;
          this.Submit();
          }
          }
  


          Submit() {
            console.log(this.signupForm.value);
            this.formDataService.formData = this.signupForm;
            this.router.navigate(['/loan/confirmation']);

          }
  

}
