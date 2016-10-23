'use strict';


import getType from '../tools/getType';
import isValidationCandidate from '../tools/isValidationCandidate';
import { dates } from '../components/types';
import stringToDate from '../tools/stringToDate';


/**
 * test the max attribute
 *
 * we use Number() instead of parseFloat(), because an invalid attribute
 * value like "123abc" should result in an error.
 */
export default function(element) {
  const type = getType(element);

  if (! isValidationCandidate(element) ||
      ! element.value || ! element.hasAttribute('max')) {
    /* we're not responsible here */
    return true;
  }

  let value, max;
  if (dates.indexOf(type) > -1) {
    value = 1 * stringToDate(element.value, type);
    max = 1 * (stringToDate(element.getAttribute('max'), type) || NaN);
  } else {
    value = Number(element.value);
    max = Number(element.getAttribute('max'));
  }

  return (isNaN(max) || value <= max);
}
