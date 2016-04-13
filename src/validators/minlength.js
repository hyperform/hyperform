'use strict';


import is_validation_candidate from './tools/is_validation_candidate';


/**
 * test the minlength attribute
 *
 * Allows empty input. If you do not want this, add the `required` attribute.
 */
export default function(element) {
  return (
      ! is_validation_candidate(element)
      ||
      ! element.value
      ||
      ! element.hasAttribute('minlength')
      ||
      element.value.length >= parseInt(element.getAttribute('minlength'), 10)
  );
}
