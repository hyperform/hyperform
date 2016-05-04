'use strict';


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
    store.set(element, message);

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
