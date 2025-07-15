import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from '../../../components/input-field/input-field.component';
import { ButtonComponent } from '../../../components/button/button.component';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputFieldComponent,
    ButtonComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  isSubmitting = false;
  formTouched = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
        phones: this.fb.array([this.createPhoneGroup()]),
        addresses: this.fb.array([this.createAddressGroup()]),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get phones(): FormArray {
    return this.signupForm.get('phones') as FormArray;
  }

  get addresses(): FormArray {
    return this.signupForm.get('addresses') as FormArray;
  }

  createPhoneGroup(): FormGroup {
    return this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,11}$/)]],
    });
  }

  createAddressGroup(): FormGroup {
    return this.fb.group({
      address: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  getPhoneGroup(index: number): FormGroup {
    return this.phones.at(index) as FormGroup;
  }

  getAddressGroup(index: number): FormGroup {
    return this.addresses.at(index) as FormGroup;
  }

  addPhone(): void {
    this.phones.push(this.createPhoneGroup());
  }

  addAddress(): void {
    this.addresses.push(this.createAddressGroup());
  }

  removePhone(index: number): void {
    this.phones.removeAt(index);
  }

  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    this.formTouched = true;
    if (this.signupForm.valid) {
      this.isSubmitting = true;
      console.log('Signup Form Data:', this.signupForm.value);

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      this.signupForm.markAllAsTouched();
    }
  }
}
