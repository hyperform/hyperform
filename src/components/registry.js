'use strict';


const internalRegistry = new WeakMap();


/**
 * A registry for custom validators
 *
 * slim wrapper around a WeakMap to ensure the values are arrays
 * (hence allowing > 1 validators per element)
 */
const customValidatorRegistry = {

  set(element, validator) {
    const current = internalRegistry.get(element) || [];
    current.push(validator);
    internalRegistry.set(element, current);
    return customValidatorRegistry;
  },

  get(element) {
    return internalRegistry.get(element) || [];
  },

  delete(element) {
    return internalRegistry.delete(element);
  },

};

export default customValidatorRegistry;
