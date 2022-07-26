'use strict';


import { get_wrapper } from './wrapper';
import mark from '../tools/mark';
import { get_radiogroup } from '../tools/get_radiogroup';


/**
 * the internal storage for messages
 */
const store = new WeakMap();


/**
 * radio buttons store the combined message on the first element
 */
function get_message_element(element) {
  if (element.type === 'radio') {
    return get_radiogroup(element)[0];
  }
  return element;
}


/**
 * handle validation messages
 *
 * Falls back to browser-native errors, if any are available. The messages
 * are String objects so that we can mark() them.
 */
const message_store = {

  set(element, message, is_custom=false) {
    element = get_message_element(element);
    if (element instanceof window.HTMLFieldSetElement) {
      const wrapped_form = get_wrapper(element);
      if (wrapped_form && ! wrapped_form.settings.extendFieldset) {
        /* make this a no-op for <fieldset> in strict mode */
        return message_store;
      }
    }

    if (typeof message === 'string') {
      /* jshint -W053 *//* allow new String() */
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
    element = get_message_element(element);
    var message = store.get(element);
    if (message === undefined && ('_original_validationMessage' in element)) {
      /* get the browser's validation message, if we have none. Maybe it
       * knows more than we. */
      /* jshint -W053 *//* allow new String() */
      message = new String(element._original_validationMessage);
    }
    /* jshint -W053 *//* allow new String() */
    return message? message : new String('');
  },

  delete(element, is_custom=false) {
    element = get_message_element(element);
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
