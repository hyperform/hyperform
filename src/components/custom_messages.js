'use strict';


/**
 * internal storage for custom error messages
 */
const store = new WeakMap();


/**
 * register custom error messages per element
 */
const custom_messages = {

  set(element, validator, message) {
    const messages = store.get(element) || {};
    messages[validator] = message;
    store.set(element, messages);
    return custom_messages;
  },

  get(element, validator, _default=undefined) {
    var messages = store.get(element);
    if (messages === undefined || ! (validator in messages)) {
      return _default;
    }
    return messages[validator];
  },

  delete(element, validator=null) {
    if (! validator) {
      return store.delete(element);
    }
    const messages = store.get(element) || {};
    if (validator in messages) {
      delete(messages[validator]);
      store.set(element, messages);
      return true;
    }
    return false;
  },

};

export default custom_messages;
