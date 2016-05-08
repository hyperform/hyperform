'use strict';


const internal_registry = new WeakMap();


/**
 * slim wrapper around a WeakMap to ensure the values are arrays
 * (hence allowing > 1 validators per element)
 */
var registry = {

  set(element, validator) {
    var current = internal_registry.get(element) || [];
    current.push(validator);
    internal_registry.set(element, current);
    return registry;
  },

  get(element) {
    return internal_registry.get(element) || [];
  },

  delete(element) {
    return internal_registry.delete(element);
  },

};

export default registry;
