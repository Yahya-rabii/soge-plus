import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormDataService } from '../../../../services/form-data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-form',
  templateUrl: './validation-form.component.html',
  styleUrls: ['./validation-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ValidationFormComponent implements OnInit {
  formData: FormGroup = new FormGroup({});
  signatureImage: string | ArrayBuffer | null = null;
  idCardFrontImage: string | ArrayBuffer | null = null;
  idCardBackImage: string | ArrayBuffer | null = null;
  receptionMethod: string | null = null;

  constructor(private formDataService: FormDataService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formData = this.formDataService.getFormData();
    this.decodeImages();

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
      const reader = new FileReader();
      reader.onload = () => {
        if (field === 'signature') {
          this.signatureImage = reader.result as string;
        } else if (field === 'idCardFront') {
          this.idCardFrontImage = reader.result as string;
        } else if (field === 'idCardBack') {
          this.idCardBackImage = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onFileInputChange(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.formData.get(controlName)?.setValue(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  decodeImages() {
    ['signature', 'idCardFront', 'idCardBack'].forEach((controlName: string) => {
      const imageData = this.formData.get(controlName)?.value;
      if (imageData) {
        const image = new Image();
        image.onload = () => {
          (this as any)[`${controlName}Image`] = image.src;
        };
        image.src = imageData;
      }
    });
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
    // Implement form submission logic here
  }
}
