import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputFieldComponent } from '../../../components/input-field/input-field.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { AuthService } from '../../../common/services/auth.service';
import { SignupRequest } from '../../../common/models/user.model';
import { ToasterService } from '../../../common/services/toaster.service';

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
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        rePassword: ['', [Validators.required, Validators.minLength(8)]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const rePassword = control.get('rePassword')?.value;

    if (password && rePassword && password !== rePassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    this.formTouched = true;
    this.errorMessage = '';

    if (this.signupForm.valid) {
      // Show confirmation dialog before submitting
      this.toasterService.confirm(
        'Create Account',
        'Are you sure you want to create an account with the provided information?',
        () => {
          this.performSignup();
        },
        {
          confirmText: 'Yes, Create Account',
          cancelText: 'Cancel',
          type: 'info',
        }
      );
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  private performSignup(): void {
    this.isSubmitting = true;

    const signupData: SignupRequest = this.signupForm.value;

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        this.toasterService.success(
          'Account Created',
          'Your account has been created successfully!'
        );
        this.router.navigate(['/shop']);
      },
      error: (error) => {
        console.error('Signup error:', error);
        this.errorMessage =
          error.error?.message || 'Signup failed. Please try again.';
        this.toasterService.error('Signup Failed', this.errorMessage);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
  navigateToSignin(): void {
    this.router.navigate(['/signin']);
  }
}
