import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormConfig } from '../models/form.model';

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule],
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss']
})
export class GenericFormComponent {
  private fb = inject(FormBuilder);

  config = input.required<FormConfig>();
  onSubmitForm = input.required<(value: any) => void>();
  onCancelForm = input<() => void>(() => {});
  onCloseForm = input<() => void>(() => {});
  onDoneForm = input<() => void>(() => {});
  onCustomActionForm = input<(action: string) => void>(() => {});

  form!: FormGroup;
  submitting = signal(false);

  constructor() {
    effect(() => {
      this.initializeForm();
    });
  }

  gridClass = computed(() => {
    return this.config().columnCount === 2 ? 'grid-2' : 'grid-1';
  });

  private initializeForm(): void {
    const group: any = {};

    this.config().fields.forEach(field => {
      const validators = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.validations) {
        if (field.validations.minLength) {
          validators.push(Validators.minLength(field.validations.minLength));
        }
        if (field.validations.maxLength) {
          validators.push(Validators.maxLength(field.validations.maxLength));
        }
        if (field.validations.pattern) {
          validators.push(Validators.pattern(field.validations.pattern));
        }
        if (field.validations.min) {
          validators.push(Validators.min(field.validations.min));
        }
        if (field.validations.max) {
          validators.push(Validators.max(field.validations.max));
        }
      }

      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      group[field.name] = [
        { 
          value: field.value || '', 
          disabled: field.disabled 
        }, 
        validators
      ];
    });

    this.form = this.fb.group(group);
  }

  showError(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  onSuffixClick(fieldName: string): void {
    console.log(fieldName)
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Invalid email format';
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}`;
    if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength}`;
    if (errors['pattern']) return 'Invalid format';
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;

    return 'Invalid value';
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid) {
      this.submitting.set(true);
      try {
        // await this.onSubmitForm(this.form.value);
      } finally {
        this.submitting.set(false);
      }
    }
  }

  onCancel(): void {
    this.onCancelForm();
  }

  onClose(): void {
    this.onCloseForm();
  }

  onDone(): void {
    this.onDoneForm();
  }

  onCustomAction(action: string): void {
  //   this.onCustomActionForm(action);
  }
}