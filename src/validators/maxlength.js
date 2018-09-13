'use strict';


import get_type from '../tools/get_type';
import unicode_string_length from '../tools/unicode_string_length';
import { text as text_types } from '../components/types';


/**
 * test the maxlength attribute
 */
export default function(element) {
  if (
      ! element.value
      ||
      text_types.indexOf(get_type(element)) === -1
      ||
      ! element.hasAttribute('maxlength')
      ||
      ! element.getAttribute('maxlength') // catch maxlength=""
  ) {
    return true;
  }

  const maxlength = parseInt(element.getAttribute('maxlength'), 10);

  /* check, if the maxlength value is usable at all.
   * We allow maxlength === 0 to basically disable input (Firefox does, too).
   */
  if (isNaN(maxlength) || maxlength < 0) {
    return true;
  }

  return unicode_string_length(element.value) <= maxlength;
}
