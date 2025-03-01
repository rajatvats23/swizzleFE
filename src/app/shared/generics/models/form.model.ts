export interface FormField {
    type: 'text' | 'number' | 'email' | 'password' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'date' | 'file' | 'tel' | 'url' | 'search' | 'time' | 'color';
    name: string;
    label: string;
    placeholder?: string;
    value?: any;
    required?: boolean;
    options?: { value: any; label: string }[];
    validations?: {
      minLength?: number;
      maxLength?: number;
      pattern?: string;
      min?: number;
      max?: number;
    };
    disabled?: boolean;
    hint?: string;
    appearance?: 'fill' | 'outline';
    prefix?: string;
    suffix?: boolean;
    iconSuffix?: string;
    textSuffix?: string;
  }
  
  export interface FormConfig {
    fields: FormField[];
    buttons: {
      submit?: boolean;
      cancel?: boolean;
      close?: boolean;
      done?: boolean;
      authSubmit?: boolean;
      authSubmitText?: string;
      custom?: { label: string; action: string; color?: string }[];
    };
    columnCount?: 1 | 2;
  }