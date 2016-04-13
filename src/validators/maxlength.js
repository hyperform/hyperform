'use strict';


import is_validation_candidate from './tools/is_validation_candidate';


/**
 * test the maxlength attribute
 *
 * Allows empty input. If you do not want this, add the `required` attribute.
 */
export default function(element) {
  return (
      ! is_validation_candidate(element)
      ||
      ! element.value
      ||
      ! element.hasAttribute('maxlength')
      ||
      element.value.length >= parseInt(element.getAttribute('maxlength'), 10)
  );
}
