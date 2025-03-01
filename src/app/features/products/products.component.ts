import { Component } from '@angular/core';
import { GenericFormComponent } from '../../shared/generics/generic-form/generic-form.component';
import { FormConfig } from '../../shared/generics/models/form.model';

@Component({
  selector: 'app-products',
  imports: [GenericFormComponent],
  template: `<app-generic-form
  [config]="formConfig"
  [onSubmitForm]="handleSubmit"
  [onCancelForm]="handleCancel"
  [onCloseForm]="handleClose"
  [onDoneForm]="handleDone"
  [onCustomActionForm]="handleCustomAction"
/>`,
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  formConfig: FormConfig = {
    fields: [
      {
        type: 'text',
        name: 'firstName',
        label: 'First Name',
        placeholder: 'Enter your first name',
        required: true,
        appearance: 'outline',
        validations: {
          minLength: 2,
          maxLength: 50
        }
      },
      {
        type: 'email',
        name: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        required: true,
        appearance: 'outline',
        hint: 'Enter a valid email address'
      },
      {
        type: 'select',
        name: 'country',
        label: 'Country',
        required: true,
        appearance: 'outline',
        options: [
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'ca', label: 'Canada' }
        ]
      },
      {
        type: 'number',
        name: 'amount',
        label: 'Amount',
        required: true,
        appearance: 'outline',
        prefix: 'attach_money',
        suffix: true,
        textSuffix: '.00'
      },
      {
        type: 'date',
        name: 'birthDate',
        label: 'Birth Date',
        required: true,
        appearance: 'outline'
      },
      {
        type: 'radio',
        name: 'gender',
        label: 'Gender',
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        type: 'textarea',
        name: 'bio',
        label: 'Biography',
        placeholder: 'Tell us about yourself',
        appearance: 'outline',
        hint: 'Maximum 500 characters'
      }
    ],
    buttons: {
      submit: true,
      cancel: true,
      close: false,
      done: true,
      custom: [
        { label: 'Save Draft', action: 'saveDraft', color: 'accent' }
      ]
    },
    columnCount: 2
  };

  handleSubmit = async (formValue: any) => {
    console.log('Form submitted:', formValue);
    // Handle form submission
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
  };

  handleCancel = () => {
    console.log('Form cancelled');
  };

  handleClose = () => {
    console.log('Form closed');
  };

  handleDone = () => {
    console.log('Form done');
  };

  handleCustomAction = (action: string) => {
    console.log('Custom action:', action);
  };
}