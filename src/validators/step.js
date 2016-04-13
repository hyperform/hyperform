'use strict';


import { is_validation_candidate } from './common';


/**
 * test the step attribute
 *
 * @TODO support steps in type=date fields
 */
export default function(element) {
  /* we use Number() instead of parseFloat(), because an invalid attribute
   * value like "123abc" should result in an error. */
  // TODO refactor those multiple "Number()" calls
  return (
      ! is_validation_candidate(element)
      ||
      ! element.value
      ||
      ! element.hasAttribute('step')
      ||
      element.getAttribute('step').toLowerCase() === 'any'
      ||
      Number(element.getAttribute('step')) <= 0
      ||
      isNaN(Number(element.getAttribute('step')))
      ||
      (
        Math.abs(Number(element.value) -
                 Number(element.getAttribute('min') || 0)) %
          Number(element.getAttribute('step'))
        < 0.00000001
        || /* crappy floating-point arithmetics! */
        Math.abs(Number(element.value) -
                 Number(element.getAttribute('min') || 0)) %
          Number(element.getAttribute('step'))
        > Number(element.getAttribute('step')) - 0.00000001
      )
    );
}
