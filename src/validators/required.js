'use strict';


import isValidationCandidate from '../tools/isValidationCandidate';


/**
 * test the required attribute
 */
export default function(element) {
  if (! isValidationCandidate(element)
      ||
      ! element.hasAttribute('required')) {
    /* nothing to do */
    return true;
  }

  /* we don't need getType() for element.type, because "checkbox" and "radio"
   * are well supported. */
  switch (element.type) {
    case 'checkbox':
      return element.checked;
      //break;
    case 'radio':
      /* radio inputs have "required" fulfilled, if _any_ other radio
       * with the same name in this form is checked. */
      return !! (
        element.checked ||
        (
          element.form &&
          Array.prototype.filter.call(
            document.getElementsByName(element.name),
            radio => radio.name === element.name &&
                     radio.form === element.form &&
                     radio.checked
          ).length > 0
        )
      );
      //break;
    default:
      return !! element.value;
  }
}
