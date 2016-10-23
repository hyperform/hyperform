'use strict';


import isValidationCandidate from '../tools/isValidationCandidate';


/**
 * test the pattern attribute
 */
export default function(element) {
  return (
      ! isValidationCandidate(element)
      ||
      ! element.value
      ||
      ! element.hasAttribute('pattern')
      ||
      (new RegExp('^(?:'+ element.getAttribute('pattern') +')$')).test(element.value)
    );
}
