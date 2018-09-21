'use strict';


import get_type from '../tools/get_type';
import { dates } from '../components/types';
import string_to_date from '../tools/string_to_date';


/**
 * test the max attribute
 *
 * we use Number() instead of parseFloat(), because an invalid attribute
 * value like "123abc" should result in an error.
 */
export default function(element) {
  const type = get_type(element);

  if (! element.value || ! element.hasAttribute('max')) {
    /* we're not responsible here */
    return true;
  }

  let value, max;
  if (dates.indexOf(type) > -1) {
    value = string_to_date(element.value, type);
    value = value === null? NaN : +value;
    max = string_to_date(element.getAttribute('max'), type);
    max = max === null? NaN : +max;
  } else {
    value = Number(element.value);
    max = Number(element.getAttribute('max'));
  }

  /* we cannot validate invalid values and trust on badInput, if isNaN(value) */
  return (isNaN(max) || isNaN(value) || value <= max);
}
