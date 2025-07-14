import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css',
})
export class InputFieldComponent {
  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';

  hasError(): boolean {
    const control = this.formGroup.get(this.controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(): string {
    const control = this.formGroup.get(this.controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return `${this.label} is required`;
    }
    if (control.errors['minlength']) {
      return `${this.label} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }
    if (control.errors['pattern']) {
      return `${this.label} contains invalid characters`;
    }
    if (control.errors['match']) {
      return `${this.label} does not match`;
    }
    return 'Invalid input';
  }
}
