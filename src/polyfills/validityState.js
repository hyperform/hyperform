'use strict';


import is_validation_candidate from '../tools/is_validation_candidate';
import mark from '../tools/mark';
import validity_state_checkers from '../tools/validity_state_checkers';


/**
 * the validity state constructor
 */
const ValidityState = function(element) {
  if (! (element instanceof window.HTMLElement)) {
    throw new Error('cannot create a ValidityState for a non-element');
  }

  const cached = ValidityState.cache.get(element);
  if (cached) {
    return cached;
  }

  if (! (this instanceof ValidityState)) {
    /* working around a forgotten `new` */
    return new ValidityState(element);
  }

  this.element = element;
  ValidityState.cache.set(element, this);
};


/**
 * the prototype for new validityState instances
 */
const ValidityStatePrototype = {};
ValidityState.prototype = ValidityStatePrototype;

ValidityState.cache = new WeakMap();

/* small wrapper around the actual validator to check if the validator
 * should actually be called. `this` refers to the ValidityState object. */
const checker_getter = func => {
  return function() {
    if (! is_validation_candidate(this.element)) {
      /* not being validated == valid by default */
      return true;
    }
    return func(this.element);
  };
};

/**
 * copy functionality from the validity checkers to the ValidityState
 * prototype
 */
for (let prop in validity_state_checkers) {
  Object.defineProperty(ValidityStatePrototype, prop, {
    configurable: true,
    enumerable: true,
    get: checker_getter(validity_state_checkers[prop]),
    set: undefined,
  });
}

/**
 * mark the validity prototype, because that is what the client-facing
 * code deals with mostly, not the property descriptor thing */
mark(ValidityStatePrototype);

export default ValidityState;
