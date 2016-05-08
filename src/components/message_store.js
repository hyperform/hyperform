'use strict';


import Wrapper from './wrapper';
import mark from '../tools/mark';


/**
 * the internal storage for messages
 */
const store = new WeakMap();


/* jshint -W053 */
var message_store = {

  set(element, message) {
    if (element instanceof window.HTMLFieldSetElement) {
      const wrapped_form = Wrapper.get_wrapped(element.form);
      if (wrapped_form && wrapped_form.settings.strict) {
        /* make this a no-op for <fieldset> in strict mode */
        return message_store;
      }
    }

    if (typeof message === 'string') {
      message = new String(message);
    }
    mark(message);
    store.set(element, message);

    /* allow the :invalid selector to match */
    if ('_original_setCustomValidity' in element) {
      element._original_setCustomValidity(message);
    }

    return message_store;
  },

  get(element) {
    var message = store.get(element);
    if (message === undefined && ('_original_validationMessage' in element)) {
      /* get the browser's validation message, if we have none. Maybe it
       * knows more than we. */
      message = new String(element._original_validationMessage);
    }
    return message? message : new String('');
  },

  delete(element) {
    if ('_original_setCustomValidity' in element) {
      element._original_setCustomValidity('');
    }
    return store.delete(element);
  },

};
/* jshint +W053 */

export default message_store;
