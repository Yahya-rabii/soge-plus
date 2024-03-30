import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  formData: FormGroup = new FormGroup({}); // Initialize formData with an empty FormGroup
 
  getFormData(): FormGroup {
    return this.formData;
  }

  setFormData(formData: FormGroup): void {
    this.formData = formData;
  }

  constructor() { }

  clearFormData(): void {
    this.formData = new FormGroup({}); // Reset formData to an empty FormGroup
  }
}
