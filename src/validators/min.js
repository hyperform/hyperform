'use strict';


import is_validation_candidate from '../tools/is_validation_candidate';
import { dates } from '../components/types';
import string_to_date from '../tools/string_to_date';


/**
 * test the min attribute
 *
 * we use Number() instead of parseFloat(), because an invalid attribute
 * value like "123abc" should result in an error.
 */
export default function(element) {

  if (! is_validation_candidate(element) ||
      ! element.value || ! element.hasAttribute('min')) {
    /* we're not responsible here */
    return true;
  }

  let value, min;
  if (dates.indexOf(element.type) > -1) {
    value = 1 * string_to_date(element.value, element.type);
    min = 1 * (string_to_date(element.getAttribute('min'), element.type) || NaN);
  } else {
    value = Number(element.value);
    min = Number(element.getAttribute('min'));
  }

  return (isNaN(min) || value >= min);
}
