'use strict';


import { get_wrapper } from '../components/wrapper';


/**
 * filter a form's elements for the ones needing validation prior to
 * a submit
 *
 * Returns an array of form elements.
 */
export function get_validated_elements(form) {
  const wrapped_form = get_wrapper(form);

  return Array.prototype.filter.call(form.elements, element => {
    /* it must have a name (or validating nameless inputs is allowed) */
    if (element.getAttribute('name') ||
        (wrapped_form && wrapped_form.settings.validateNameless)) {
      return true;
    }
    return false;
  });
}
