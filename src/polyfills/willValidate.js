'use strict';


import isValidationCandidate from '../tools/isValidationCandidate';


/**
 * check, if an element will be subject to HTML5 validation at all
 */
export default function willValidate(element) {
  return isValidationCandidate(element);
}
