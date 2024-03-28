import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormDataService } from '../../../../services/form-data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Loan } from '../../../../models/loan.model';
import { LoanService } from '../../../../services/loan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-validation-form',
  templateUrl: './validation-form.component.html',
  styleUrls: ['./validation-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ]
})
export class ValidationFormComponent implements OnInit {
  formData: FormGroup = new FormGroup({});
  signature: File | undefined;
  idCardFront: File |undefined;
  idCardBack: File | undefined;
  receptionMethod: string | null = null;
  loan: Loan = new Loan();

  constructor(private formDataService: FormDataService, private fb: FormBuilder , private LoanService: LoanService , private router: Router) { }

  ngOnInit(): void {

    this.formData = this.formDataService.getFormData();


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
        const agencySelectionSection = document.getElementById('agencySelectionSection');
        if (agencySelectionSection) {
          agencySelectionSection.style.display = 'none';
        }
      } else if (this.receptionMethod === 'ON_AGENCY') {
        const ribSection = document.getElementById('ribSection');
        if (ribSection) {
          ribSection.style.display = 'none';
        }
        const agencySelectionSection = document.getElementById('agencySelectionSection');
        if (agencySelectionSection) {
          agencySelectionSection.style.display = 'block';
        }
      }
    });
  }


  updateFormDisplay() {
    const ribSection = document.getElementById('ribSection');
    const agencySelectionSection = document.getElementById('agencySelectionSection');

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



  onFileSelected(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    const file: File | null = (inputElement.files as FileList)[0] || null;
    if (file) {
      if (field === 'signature') {
        this.signature = file;
        this.formData.patchValue({ signature: file });
      } else if (field === 'idCardFront') {
        this.idCardFront = file;
        this.formData.patchValue({ idCardFront: file });
      } else if (field === 'idCardBack') {
        this.idCardBack = file;
        this.formData.patchValue({ idCardBack: file });
      }
      
    }
  }


  toggleModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.toggle('hidden');
      // set focus on the modal
      modal.focus();
      // make the modal centered
      modal.style.top = '50%';
      modal.style.left = '50%';
      modal.style.transform = 'translate(-50%, -50%)';

      // set the modal to be visible
      modal.style.visibility = 'visible';

      //make the modal absolute
      modal.style.position = 'absolute';

      // make the modal background color to be black with some opacity

      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

      // make the baground take the whole screen
      modal.style.width = '100%';
      modal.style.height = '100%';


    }
  }

  closeModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
     
      modal.classList.add('hidden');
      modal.style.visibility = 'hidden';
      // make the modal background to be back to normal
      modal.style.backgroundColor = 'transparent';
    }
  }
  

  submitForm() {
   
    if (this.receptionMethod === 'ONLINE') {
      this.formData.get('selectedAgency')?.setValue('');
    } else if (this.receptionMethod === 'ON_AGENCY') {
      this.formData.get('rib')?.setValue('');
    }



    this.loan = new Loan(
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
      localStorage.getItem('UserId') || ''
    );
      

    // call the createLoan method from the LoanService and pass the Loan object as an argument
    this.LoanService.createLoan(this.loan)
      .then((response) => {
        // if the createLoan method is successful, display a success message
        alert('Loan created successfully');
        // redirect to the home page
        //this.router.navigate(['/']);
      })
      .catch((error) => {
        // if the createLoan method fails, display an error message
        alert('Error creating Loan');
      });


  }
}
