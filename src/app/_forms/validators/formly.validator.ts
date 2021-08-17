import {FormControl, ValidationErrors} from '@angular/forms';
import {FieldType, FormlyFieldConfig} from '@ngx-formly/core';
import EMAIL_REGEX from './email.regex';
import PHONE_REGEX from './phone.regex';
import URL_REGEX from './url.regex';

export const EmailValidator = (control: FormControl): ValidationErrors => {
  return !control.value || EMAIL_REGEX.test(control.value) ? null : {email: true};
};

export const EmailValidatorMessage = (err, field: FormlyFieldConfig) => `"${field.formControl.value}" is not a valid email address`;

export const UrlValidator = (control: FormControl): ValidationErrors => {
  return !control.value || URL_REGEX.test(control.value) ? null : {url: true};
};

export const UrlValidatorMessage = (err, field: FormlyFieldConfig) => {
  return `We cannot save "${field.formControl.value}". Please provide the full path, including http:// or https://`;
};

export const PhoneValidator = (control: FormControl): ValidationErrors => {
  return !control.value || PHONE_REGEX.test(control.value) ? null : {phone: true};
};

export const PhoneValidatorMessage = (err, field: FormlyFieldConfig) => `"${field.formControl.value}" is not a valid phone number`;

export const MulticheckboxValidator = (control: FormControl): ValidationErrors => {
  if (control.value) {
    for (const key in control.value) {
      if (control.value[key] === true) {
        return null;
      }
    }
  }
  return {required: true};
};

export const MulticheckboxValidatorMessage = (err, field: FormlyFieldConfig) => 'At least one of these checkboxes must be selected.';

export const MinValidationMessage = (err, field) => `This value should be more than ${field.templateOptions.min}`;

export const MaxValidationMessage = (err, field) => `This value should be less than ${field.templateOptions.max}`;

export const ShowError = (field: FieldType) => field.formControl &&
    field.formControl.invalid &&
    (
      field.formControl.dirty ||
      (field.options && field.options.parentForm && field.options.parentForm.submitted) ||
      (field.field && field.field.validation && field.field.validation.show)
    );
