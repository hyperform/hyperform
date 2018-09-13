'use strict';


import { do_filter } from '../components/hooks';
import { validation_candidates, non_inputs } from '../components/types';
import { get_wrapper } from '../components/wrapper';
import get_type from '../tools/get_type';


/**
 * check if an element should be ignored due to any of its parents
 *
 * Checks <fieldset disabled> and <datalist>.
 */
function is_in_disallowed_parent(element) {
  let p = element.parentNode;
  while (p && p.nodeType === 1) {
    if (p instanceof window.HTMLFieldSetElement &&
        p.hasAttribute('disabled')) {
      /* quick return, if it's a child of a disabled fieldset */
      return true;
    } else if (p.nodeName.toUpperCase() === 'DATALIST') {
      /* quick return, if it's a child of a datalist
       * Do not use HTMLDataListElement to support older browsers,
       * too.
       * @see https://html.spec.whatwg.org/multipage/forms.html#the-datalist-element:barred-from-constraint-validation
       */
      return true;
    } else if (p === element.form) {
      /* the outer boundary. We can stop looking for relevant elements. */
      break;
    }
    p = p.parentNode;
  }
  return false;
}


/**
 * check if an element is a candidate for constraint validation
 *
 * @see https://html.spec.whatwg.org/multipage/forms.html#barred-from-constraint-validation
 */
export default function(element) {

  /* allow a shortcut via filters, e.g. to validate type=hidden fields */
  const filtered = do_filter('is_validation_candidate', null, element);
  if (filtered !== null) {
    return !! filtered;
  }

  /* it must be any of those elements */
  if (element instanceof window.HTMLSelectElement
      ||
      element instanceof window.HTMLTextAreaElement
      ||
      element instanceof window.HTMLButtonElement
      ||
      element instanceof window.HTMLInputElement) {

    const type = get_type(element);
    /* its type must be in the whitelist */
    if (non_inputs.indexOf(type) > -1 ||
        validation_candidates.indexOf(type) > -1) {

      /* it mustn't be disabled or readonly */
      if (! element.hasAttribute('disabled') &&
          ! element.hasAttribute('readonly')) {

        const wrapped_form = get_wrapper(element);

        if (
            /* the parent form doesn't allow non-standard "novalidate" attributes... */
            (wrapped_form && ! wrapped_form.settings.novalidateOnElements) ||
            /* ...or it doesn't have such an attribute/property */
            (! element.hasAttribute('novalidate') && ! element.noValidate)
            ) {

          /* it isn't part of a <fieldset disabled> */
          if (! is_in_disallowed_parent(element)) {

            /* then it's a candidate */
            return true;
          }
        }
      }
    }
  }

  /* this is no HTML5 validation candidate... */
  return false;
}
