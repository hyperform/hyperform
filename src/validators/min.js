'use strict';


import get_type from '../tools/get_type';
import { dates } from '../components/types';
import string_to_date from '../tools/string_to_date';


/**
 * test the min attribute
 *
 * we use Number() instead of parseFloat(), because an invalid attribute
 * value like "123abc" should result in an error.
 */
export default function(element) {
  const type = get_type(element);

  if (! element.value || ! element.hasAttribute('min')) {
    /* we're not responsible here */
    return true;
  }

  let value, min;
  if (dates.indexOf(type) > -1) {
    value = string_to_date(element.value, type);
    value = value === null? NaN : +value;
    min = string_to_date(element.getAttribute('min'), type);
    min = min === null? NaN : +min;
  } else {
    value = Number(element.value);
    min = Number(element.getAttribute('min'));
  }

  /* we cannot validate invalid values and trust on badInput, if isNaN(value) */
  return (isNaN(min) || isNaN(value) || value >= min);
}
