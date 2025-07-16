import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css',
})
export class InputFieldComponent {
  formGroup = input.required<FormGroup>();
  controlName = input.required<string>();
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');

  hasError(): boolean {
    const control = this.formGroup().get(this.controlName());
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(): string {
    const control = this.formGroup().get(this.controlName());
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return `${this.label()} is required`;
    }
    if (control.errors['minlength']) {
      return `${this.label()} must be at least ${
        control.errors['minlength'].requiredLength
      } characters`;
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }
    if (control.errors['pattern']) {
      return `${this.label()} contains invalid characters`;
    }
    if (control.errors['match']) {
      return `${this.label()} does not match`;
    }
    return 'Invalid input';
  }
}
