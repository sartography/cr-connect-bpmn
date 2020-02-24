import {FormControl} from '@angular/forms';
import {ValidateEmail} from './email.validator';

describe('ValidateEmail', () => {
  const control = new FormControl();

  it('should return an error for an invalid email address', () => {
    const emailsToTest = [
      '124535',
      'not an email address',
      '@gmail.com',
      'incomplete@domain',
      'tooshort@tld.c',
    ];

    for (const email of emailsToTest) {
      control.setValue(email);
      expect(ValidateEmail(control)).toEqual({email: true});
    }
  });

  it('should not return an error for a valid email address', () => {
    const emailsToTest = [
      'short@tld.co',
      'simple@email.edu',
      'more+complicated@www.email-server.mail',
      'this.is.a.valid.email+address@some-random.email-server.com',
    ];

    for (const email of emailsToTest) {
      control.setValue(email);
      expect(ValidateEmail(control)).toBeUndefined();
    }
  });

});
