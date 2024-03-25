import { Component, OnInit } from '@angular/core';
import { FormDataService } from '../../../../services/form-data.service';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-form',
  templateUrl: './validation-form.component.html',
  styleUrls: ['./validation-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule]
})
export class ValidationFormComponent implements OnInit {
  formData: FormGroup;

  constructor(private formDataService: FormDataService) { 
    this.formData = this.formDataService.formData ?? new FormGroup({});
  }

  ngOnInit(): void {
    // Access transferred form data from the service
    this.formData = this.formDataService.formData ?? new FormGroup({});
  }
}
