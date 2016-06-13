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
    const messages = store.get(element);
    if (messages === undefined || ! (validator in messages)) {
      const data_id = 'data-' + validator.replace(/[A-Z]/g, '-$&').toLowerCase();
      if (element.hasAttribute(data_id)) {
        /* if the element has a data-validator attribute, use this as fallback.
         * E.g., if validator == 'valueMissing', the element can specify a
         * custom validation message like this:
         *     <input data-value-missing="Oh noes!">
         */
        return element.getAttribute(data_id);
      }
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
