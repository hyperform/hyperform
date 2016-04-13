'use strict';


import is_validation_candidate from '../tools/is_validation_candidate';


/**
 * test the pattern attribute
 */
export default function(element) {
  return (
      ! is_validation_candidate(element)
      ||
      ! element.value
      ||
      ! element.hasAttribute('pattern')
      ||
      (new RegExp('^(?:'+ element.getAttribute('pattern') +')$')).test(element.value)
    );
}
