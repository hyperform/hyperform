'use strict';


import getType from '../tools/getType';
import isValidationCandidate from '../tools/isValidationCandidate';
import unicodeStringLength from '../tools/unicodeStringLength';
import { text as textTypes } from '../components/types';


/**
 * test the maxlength attribute
 */
export default function(element) {
  if (
      ! isValidationCandidate(element)
      ||
      ! element.value
      ||
      textTypes.indexOf(getType(element)) === -1
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

  return unicodeStringLength(element.value) <= maxlength;
}
