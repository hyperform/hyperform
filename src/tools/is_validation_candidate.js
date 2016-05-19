'use strict';


import { validation_candidates, non_inputs } from '../components/types';
import Wrapper from '../components/wrapper';
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
    /* its type must be in the whitelist or missing (select, textarea) */
    if (! type ||
        non_inputs.indexOf(type) > -1 ||
        validation_candidates.indexOf(type) > -1) {

      /* it mustn't be disabled or readonly */
      if (! element.hasAttribute('disabled') &&
          ! element.hasAttribute('readonly')) {

        const wrapped_form = Wrapper.get_wrapped(element);
        /* it hasn't got the (non-standard) attribute 'novalidate' or its
         * parent form has got the strict parameter */
        if ((wrapped_form && wrapped_form.settings.strict) ||
            ! element.hasAttribute('novalidate') ||
            ! element.noValidate) {

          /* it isn't part of a <fieldset disabled> */
          let p = element.parentNode;
          while (p && p.nodeType === 1) {
            if (p instanceof window.HTMLFieldSetElement &&
                p.hasAttribute('disabled')) {
              /* quick return, if it's a child of a disabled fieldset */
              return false;
            } else if (p === element.form) {
              /* the outer boundary. We can stop looking for relevant
               * fieldsets. */
              break;
            }
            p = p.parentNode;
          }

          /* then it's a candidate */
          return true;
        }
      }

    }

  }

  /* this is no HTML5 validation candidate... */
  return false;
}
