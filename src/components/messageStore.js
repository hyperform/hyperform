'use strict';


import { getWrapper } from './wrapper';
import mark from '../tools/mark';


/**
 * the internal storage for messages
 */
const store = new WeakMap();


/* jshint -W053 */
const messageStore = {

  set(element, message, isCustom=false) {
    if (element instanceof window.HTMLFieldSetElement) {
      const wrappedForm = getWrapper(element);
      if (wrappedForm && ! wrappedForm.settings.extendFieldset) {
        /* make this a no-op for <fieldset> in strict mode */
        return messageStore;
      }
    }

    if (typeof message === 'string') {
      message = new String(message);
    }
    if (isCustom) {
      message.isCustom = true;
    }
    mark(message);
    store.set(element, message);

    /* allow the :invalid selector to match */
    if ('_original_setCustomValidity' in element) {
      element._original_setCustomValidity(message.toString());
    }

    return messageStore;
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

export default messageStore;
