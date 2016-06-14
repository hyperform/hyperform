'use strict';


const internal_registry = new WeakMap();


/**
 * A registry for custom validators
 *
 * slim wrapper around a WeakMap to ensure the values are arrays
 * (hence allowing > 1 validators per element)
 */
const custom_validator_registry = {

  set(element, validator) {
    const current = internal_registry.get(element) || [];
    current.push(validator);
    internal_registry.set(element, current);
    return custom_validator_registry;
  },

  get(element) {
    return internal_registry.get(element) || [];
  },

  delete(element) {
    return internal_registry.delete(element);
  },

};

export default custom_validator_registry;
