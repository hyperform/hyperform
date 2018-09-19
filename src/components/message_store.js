'use strict';


import { get_wrapper } from './wrapper';
import mark from '../tools/mark';


/**
 * the internal storage for messages
 */
const store = new WeakMap();


/* jshint -W053 *//* allow new String() */
/**
 * handle validation messages
 *
 * Falls back to browser-native errors, if any are available. The messages
 * are String objects so that we can mark() them.
 */
const message_store = {

  set(element, message, is_custom=false) {
    if (element instanceof window.HTMLFieldSetElement) {
      const wrapped_form = get_wrapper(element);
      if (wrapped_form && ! wrapped_form.settings.extendFieldset) {
        /* make this a no-op for <fieldset> in strict mode */
        return message_store;
      }
    }

    if (typeof message === 'string') {
      message = new String(message);
    }
    if (is_custom) {
      message.is_custom = true;
    }
    mark(message);
    store.set(element, message);

    /* allow the :invalid selector to match */
    if ('_original_setCustomValidity' in element) {
      element._original_setCustomValidity(message.toString());
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

  delete(element, is_custom=false) {
    if ('_original_setCustomValidity' in element) {
      element._original_setCustomValidity('');
    }
    var message = store.get(element);
    if (message && is_custom && ! message.is_custom) {
      /* do not delete "native" messages, if asked */
      return false;
    }
    return store.delete(element);
  },

};
/* jshint +W053 */

export { message_store };
