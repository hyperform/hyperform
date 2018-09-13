'use strict';


import get_type from '../tools/get_type';
import unicode_string_length from '../tools/unicode_string_length';
import { text as text_types } from '../components/types';


/**
 * test the minlength attribute
 */
export default function(element) {
  if (
      ! element.value
      ||
      text_types.indexOf(get_type(element)) === -1
      ||
      ! element.hasAttribute('minlength')
      ||
      ! element.getAttribute('minlength') // catch minlength=""
  ) {
    return true;
  }

  const minlength = parseInt(element.getAttribute('minlength'), 10);

  /* check, if the minlength value is usable at all. */
  if (isNaN(minlength) || minlength < 0) {
    return true;
  }

  return unicode_string_length(element.value) >= minlength;
}
