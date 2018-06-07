'use strict';


import is_validation_candidate from '../tools/is_validation_candidate';
import mark from '../tools/mark';
import { message_store } from '../components/message_store';
import { get_wrapper } from '../components/wrapper';
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
    if (! is_validation_candidate(this.element)) {
      /* not being validated == valid by default */
      return true;
    }

    const wrapper = get_wrapper(this.element);
    const validClass = wrapper && wrapper.settings.classes.valid || 'hf-valid';
    const invalidClass = wrapper && wrapper.settings.classes.invalid || 'hf-invalid';
    const userInvalidClass = wrapper && wrapper.settings.classes.userInvalid || 'hf-user-invalid';
    const userValidClass = wrapper && wrapper.settings.classes.userValid || 'hf-user-valid';
    const inRangeClass = wrapper && wrapper.settings.classes.inRange || 'hf-in-range';
    const outOfRangeClass = wrapper && wrapper.settings.classes.outOfRange || 'hf-out-of-range';
    const validatedClass = wrapper && wrapper.settings.classes.validated || 'hf-validated';

    this.element.classList.add(validatedClass);

    for (let prop in validity_state_checkers) {
      if (validity_state_checkers[prop](this.element)) {
        this.element.classList.add(invalidClass);
        this.element.classList.remove(validClass);
        this.element.classList.remove(userValidClass);
        if (this.element.value !== this.element.defaultValue) {
          this.element.classList.add(userInvalidClass);
        } else {
          this.element.classList.remove(userInvalidClass);
        }
        this.element.setAttribute('aria-invalid', 'true');
        return false;
      }
    }

    message_store.delete(this.element);
    this.element.classList.remove(invalidClass);
    this.element.classList.remove(userInvalidClass);
    this.element.classList.remove(outOfRangeClass);
    this.element.classList.add(validClass);
    this.element.classList.add(inRangeClass);
    if (this.element.value !== this.element.defaultValue) {
      this.element.classList.add(userValidClass);
    } else {
      this.element.classList.remove(userValidClass);
    }
    this.element.setAttribute('aria-invalid', 'false');
    return true;
  },
  set: undefined,
});

/**
 * mark the validity prototype, because that is what the client-facing
 * code deals with mostly, not the property descriptor thing */
mark(ValidityStatePrototype);

export default ValidityState;
