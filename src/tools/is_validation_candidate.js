'use strict';


/* missing from this set are: button, hidden, menu (from <button>), reset */
const validation_candidate_types = [ 'checkbox', 'color', 'date', 'datetime',
  'datetime-local', 'email', 'file', 'image', 'month', 'number', 'password',
  'radio', 'range', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week', ];


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

    /* it's type must be in the whitelist or missing (select, textarea) */
    if (! element.type ||
        validation_candidate_types.indexOf(element.type) > -1) {

      /* it mustn't be disabled or readonly */
      if (! element.disabled && ! element.readonly) {

        /* then it's a candidate */
        return true;
      }

    }

  }

  /* this is no HTML5 validation candidate... */
  return false;
}
