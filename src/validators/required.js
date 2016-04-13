'use strict';


import is_validation_candidate from '../tools/is_validation_candidate';


/**
 * test the required attribute
 */
export default function(element) {
  if (! is_validation_candidate(element)
      ||
      ! element.hasAttribute('required')) {
    /* nothing to do */
    return true;
  }

  switch (element.type) {
    case 'checkbox':
      return element.checked;
      //break;
    case 'radio':
      /* radio inputs have "required" fulfilled, if _any_ other radio
       * with the same name in this form is checked. */
      return (
        element.checked
        ||
        Array.prototype.filter.call(
          element.form.getElementsByName(element.name),
          radio => radio.form === element.form && radio.checked).length > 0
      );
      //break;
    default:
      return !! element.value;
  }
}
