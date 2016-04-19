'use strict';


import is_validation_candidate from '../tools/is_validation_candidate';
import { dates } from '../components/types';
import string_to_date from '../tools/string_to_date';


/**
 * test the max attribute
 *
 * we use Number() instead of parseFloat(), because an invalid attribute
 * value like "123abc" should result in an error.
 */
export default function(element) {

  if (! is_validation_candidate(element) ||
      ! element.value || ! element.hasAttribute('max')) {
    /* we're not responsible here */
    return true;
  }

  let value, max;
  if (dates.indexOf(element.type) > -1) {
    value = 1 * string_to_date(element.value, element.type);
    max = 1 * (string_to_date(element.getAttribute('max'), element.type) || NaN);
  } else {
    value = Number(element.value);
    max = Number(element.getAttribute('max'));
  }

  return (isNaN(max) || value <= max);
}
