'use strict';


import { validation_candidates, non_inputs } from '../components/types';
import get_type from '../tools/get_type';


/**
 * check if an element is a candidate for constraint validation
 *
 * @see https://html.spec.whatwg.org/multipage/forms.html#barred-from-constraint-validation
 */
export default function(element) {
  /* it must be any of those elements */
  if (element instanceof window.HTMLSelectElement
      ||
      element instanceof window.HTMLTextAreaElement
      ||
      element instanceof window.HTMLButtonElement
      ||
      element instanceof window.HTMLInputElement) {

    const type = get_type(element);
    /* it's type must be in the whitelist or missing (select, textarea) */
    if (! type ||
        non_inputs.indexOf(type) > -1 ||
        validation_candidates.indexOf(type) > -1) {

      /* it mustn't be disabled or readonly */
      if (! element.hasAttribute('disabled') &&
          ! element.hasAttribute('readonly')) {

        /* then it's a candidate */
        return true;
      }

    }

  }

  /* this is no HTML5 validation candidate... */
  return false;
}
