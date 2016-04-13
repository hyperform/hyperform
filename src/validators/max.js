'use strict';


import is_validation_candidate from '../tools/is_validation_candidate';


/**
 * test the max attribute
 *
 * @TODO support max in type=date fields
 */
export default function(element) {
  /* we use Number() instead of parseFloat(), because an invalid attribute
   * value like "123abc" should result in an error. */
  return (
      ! is_validation_candidate(element)
      ||
      ! element.value
      ||
      ! element.hasAttribute('max')
      ||
      isNaN(Number(element.getAttribute('max')))
      ||
      Number(element.value) <= Number(element.getAttribute('max'))
    );
}
