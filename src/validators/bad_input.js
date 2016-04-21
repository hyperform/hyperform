'use strict';


import is_validation_candidate from '../tools/is_validation_candidate';
import string_to_date from '../tools/string_to_date';
import { input_checked } from '../components/types';


/**
 * test whether the element suffers from bad input
 */
export default function(element) {
  if (! is_validation_candidate(element) ||
      ! element.value ||
      input_checked.indexOf(element.type) === -1) {
    /* we're not interested, thanks! */
    return true;
  }

  var result = true;
  switch (element.type) {
    case 'color':
      result = /^#[a-f0-9]{6}$/.test(element.value);
      break;
    case 'number':
    case 'range':
      result = ! isNaN(Number(element.value));
      break;
    case 'datetime':
    case 'date':
    case 'month':
    case 'week':
    case 'time':
      result = string_to_date(element.value, element.type) !== null;
      break;
    case 'datetime-local':
      result = /^([0-9]{4,})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9])(?:\.([0-9]{1,3}))?)?$/.test(element.value);
      break;
    case 'email':
      // TODO can we do this at all? Punycode conversion would be done by
      // the browser or not at all. If not, typeMismatch will catch that
      // alltogether.
      break;
  }

  return result;
}
