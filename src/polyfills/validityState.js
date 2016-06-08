'use strict';


import installer from '../tools/property_installer';
import is_validation_candidate from '../tools/is_validation_candidate';
import mark from '../tools/mark';
import message_store from '../components/message_store';
import { get_wrapper } from '../components/wrapper';
import validity_state_checkers from '../tools/validity_state_checkers';


/**
 * the validity state constructor
 */
var ValidityState = function(element) {
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
var ValidityStatePrototype = {};
ValidityState.prototype = ValidityStatePrototype;

ValidityState.cache = new WeakMap();

/**
 * copy functionality from the validity checkers to the ValidityState
 * prototype
 */
for (let prop in validity_state_checkers) {
  Object.defineProperty(ValidityStatePrototype, prop, {
    configurable: true,
    enumerable: true,
    get: (func => function() {
      return func(this.element);
    })(validity_state_checkers[prop]),
    set: undefined,
  });
}

/**
 * the "valid" property calls all other validity checkers and returns true,
 * if all those return false.
 *
 * This is the major access point for _all_ other API methods, namely
 * (check|report)Validity().
 */
Object.defineProperty(ValidityStatePrototype, 'valid', {
  configurable: true,
  enumerable: true,
  get: function() {
    const wrapper = get_wrapper(this.element);
    const validClass = wrapper && wrapper.settings.classes.valid || 'hf-valid';
    const invalidClass = wrapper && wrapper.settings.classes.invalid || 'hf-invalid';
    const validatedClass = wrapper && wrapper.settings.classes.validated || 'hf-validated';

    this.element.classList.add(validatedClass);

    if (is_validation_candidate(this.element)) {
      for (let prop in validity_state_checkers) {
        if (validity_state_checkers[prop](this.element)) {
          this.element.classList.add(invalidClass);
          this.element.classList.remove(validClass);
          this.element.setAttribute('aria-invalid', 'true');
          return false;
        }
      }
    }

    message_store.delete(this.element);
    this.element.classList.remove(invalidClass);
    this.element.classList.add(validClass);
    this.element.setAttribute('aria-invalid', 'false');
    return true;
  },
  set: undefined,
});

mark(ValidityStatePrototype);


/**
 * publish a convenience function to replace the native element.validity
 */
ValidityState.install = installer('validity', {
  get: function() { return ValidityState(this); },
});


export default ValidityState;
