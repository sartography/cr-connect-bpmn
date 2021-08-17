import { AbstractControl, ValidationErrors } from '@angular/forms';
import EMAIL_REGEX from './email.regex';

export const ValidateEmail = (control: AbstractControl): ValidationErrors => {
  if (!EMAIL_REGEX.test(control.value) && control.value && control.value !== '') {
    const error: ValidationErrors = { email: true };
    return error;
  }
};
