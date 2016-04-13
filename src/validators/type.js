'use strict';


import is_validation_candidate from '../tools/is_validation_candidate';


/* the spec says to only check those. ¯\_(ツ)_/¯ */
const checked_types = ['email', 'url'];

/* we use a dummy <a> where we set the href to test URL validity */
const url_canary = document.createElement('a');

/* see https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address */
const email_pattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * test the type-inherent syntax
 */
export default function(element) {
  if (! is_validation_candidate(element) ||
      ! element.value ||
      ! checked_types.contains(element.type)) {
    /* we're not responsible for this element */
    return true;
  }

  var is_valid = true;

  switch (element.type) {
    case 'url':
        url_canary.href = element.value;
        is_valid = (url_canary.href === element.value ||
                    url_canary.href === element.value+'/');
        break;
    case 'email':
        if (element.hasAttribute('multiple')) {
          is_valid = element.value
                       .split(',')
                       .map(item => item.trim())
                       .every(value => email_pattern.test(value));
        } else {
          is_valid = email_pattern.test(element.value);
        }
        break;
  }

  return is_valid;
}
