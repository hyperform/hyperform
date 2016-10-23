'use strict';


import getType from '../tools/getType';
import isValidationCandidate from '../tools/isValidationCandidate';
import unicodeStringLength from '../tools/unicodeStringLength';
import { text as textTypes } from '../components/types';


/**
 * test the minlength attribute
 */
export default function(element) {
  if (
      ! isValidationCandidate(element)
      ||
      ! element.value
      ||
      textTypes.indexOf(getType(element)) === -1
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

  return unicodeStringLength(element.value) >= minlength;
}
