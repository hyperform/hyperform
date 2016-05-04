'use strict';


import mark from '../tools/mark';


/**
 * the internal storage for messages
 */
const store = new WeakMap();


/* jshint -W053 */
var message_store = {

  set(element, message) {
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
      message = new String(element._original_validationMessage);
    }
    return message? message : new String('');
  },

  delete(element) {
    return store.delete(element);
  },

};
/* jshint +W053 */

export default message_store;
