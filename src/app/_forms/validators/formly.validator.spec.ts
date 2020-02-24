import {FormControl} from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {FieldType} from '@ngx-formly/material';
import * as Validators from './formly.validator';

describe('Formly Validators', () => {
  let control: FormControl;
  let err: Error;
  let field: FormlyFieldConfig;

  beforeEach(() => {
    control = new FormControl();
    err = new Error('some error');
    field = {
      type: 'email',
      templateOptions: {},
      formControl: control,
    };
  });

  it('should validate emails', () => {
    control.setValue('');
    expect(Validators.EmailValidator(control)).toBeNull();

    control.setValue('a@b');
    expect(Validators.EmailValidator(control)).toEqual({email: true});

    control.setValue('a@b.c');
    expect(Validators.EmailValidator(control)).toEqual({email: true});

    control.setValue('a@b.com');
    expect(Validators.EmailValidator(control)).toBeNull();
  });

  it('should email validator message', () => {
    control.setValue('bad_email');
    expect(Validators.EmailValidatorMessage(err, field)).toContain('bad_email');
  });

  it('should validate URL strings', () => {
    const badUrls = [
      'bad_url',
      'http://',
      'http://bad',
      'bad.com',
    ];
    badUrls.forEach(url => {
      control.setValue(url);
      expect(Validators.UrlValidator(control)).toEqual({url: true});
    });

    const goodUrls = [
      'http://good.url.com',
      'ftp://who-uses.ftp-these-days.com',
      'https://this.is.actually:5432/a/valid/url?doncha=know#omg',
    ];
    goodUrls.forEach(url => {
      control.setValue(url);
      expect(Validators.UrlValidator(control)).toBeNull();
    });
  });

  it('should return a url validator message', () => {
    control.setValue('bad_url');
    expect(Validators.UrlValidatorMessage(err, field)).toContain('bad_url');
  });

  it('should validate phone numbers', () => {
    const badPhones = [
      'not a phone number',
      '54321',
      '3.1415926535897932384...',
      '(800) CALL-BRAD',
      '(540) 155-5555',
      '(999) 654-3210',
      '1234567890',
    ];
    badPhones.forEach(phone => {
      control.setValue(phone);
      expect(Validators.PhoneValidator(control)).toEqual({phone: true});
    });

    const goodPhones = [
      '12345678909',
      '1-800-555-5555',
      '(987) 654-3210',
      '(540) 555-1212 x321',
      '(540) 555-1212 ext 321',
      '(540) 555-1212 Ext. 321',
      '540.555.5555',
      '540.555.5555extension321',
    ];
    goodPhones.forEach(phone => {
      control.setValue(phone);
      expect(Validators.PhoneValidator(control)).toBeNull();
    });
  });

  it('should return phone validator message', () => {
    control.setValue('bad_number');
    expect(Validators.PhoneValidatorMessage(err, field)).toContain('bad_number');
  });

  it('should return error if at least one checkbox in multicheckbox is not checked', () => {
    control.setValue({});
    expect(Validators.MulticheckboxValidator(control)).toEqual({required: true});

    control.setValue({
      checkbox_a: true,
      checkbox_b: false,
      checkbox_c: false,
    });
    expect(Validators.MulticheckboxValidator(control)).toBeNull();
  });

  it('should return multicheckbox validator message', () => {
    control.setValue({});
    expect(Validators.MulticheckboxValidatorMessage(err, field))
      .toEqual('At least one of these checkboxes must be selected.');
  });

  it('should min validation message', () => {
    field.templateOptions.min = 42;
    expect(Validators.MinValidationMessage(err, field)).toContain('42');
  });

  it('should max validation message', () => {
    field.templateOptions.max = 42;
    expect(Validators.MaxValidationMessage(err, field)).toContain('42');
  });

  it('should show error', () => {
    expect(Validators.ShowError(field as FieldType)).toBeFalsy();

    control.setErrors({url: true});
    control.markAsDirty();
    expect(Validators.ShowError(field as FieldType)).toBeTruthy();

    field.formControl = undefined;
    expect(Validators.ShowError(field as FieldType)).toBeFalsy();
  });
});
