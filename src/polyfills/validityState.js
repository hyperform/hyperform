'use strict';

/**
 * validation messages are from Firefox source,
 * http://mxr.mozilla.org/mozilla-central/source/dom/locales/en-US/chrome/dom/dom.properties
 * released under MPL license, http://mozilla.org/MPL/2.0/.
 */


import installer from '../tools/property_installer';
import sprintf from '../tools/sprintf';
import get_next_valid from '../tools/get_next_valid';
import message_store from '../components/message_store';
import _ from '../components/localization';
import test_max from '../validators/max';
import test_maxlength from '../validators/maxlength';
import test_min from '../validators/min';
import test_minlength from '../validators/minlength';
import test_pattern from '../validators/pattern';
import test_required from '../validators/required';
import test_step from '../validators/step';
import test_type from '../validators/type';


/**
 * Implement constraint checking functionality defined in the HTML5 standard
 *
 * @see https://html.spec.whatwg.org/multipage/forms.html#dom-cva-validity
 * @return bool true if the test fails [!], false otherwise
 */
const validity_state_checkers = {
  badInput: element => {
    // TODO
    return false;
  },

  customError: element => {
    const msg = message_store.get(element);
    const invalid = (msg && 'is_custom' in msg);
    /* no need for message_store.set, because the message is already there. */
    return invalid;
  },

  patternMismatch: element => {
    const invalid = ! test_pattern(element);
    if (invalid) {
      message_store.set(element,
        element.title?
          sprintf(_('Please match the requested format: %s.'), element.title)
          :
          _('Please match the requested format.')
      );
    }
    return invalid;
  },

  rangeOverflow: element => {
    const invalid = ! test_max(element);

    if (invalid) {
      let msg;
      switch (element.type) {
        case 'date':
        case 'datetime':
        case 'datetime-local':
        case 'time':
          msg = sprintf(_('Please select a value that is no later than %s.'),
              element.value);
          break;
        // case 'number':
        default:
          msg = sprintf(_('Please select a value that is no more than %s.'),
              element.value);
          break;
      }
      message_store.set(element, msg);
    }

    return invalid;
  },

  rangeUnderflow: element => {
    const invalid = ! test_min(element);

    if (invalid) {
      let msg;
      switch (element.type) {
        case 'date':
        case 'datetime':
        case 'datetime-local':
        case 'time':
          msg = sprintf(_('Please select a value that is no earlier than %s.'),
              element.value);
          break;
        // case 'number':
        default:
          msg = sprintf(_('Please select a value that is no less than %s.'),
              element.value);
          break;
      }
      message_store.set(element, msg);
    }

    return invalid;
  },

  stepMismatch: element => {
    const invalid = ! test_step(element);

    if (invalid) {
      let [min, max] = get_next_valid(element);
      let sole = false;

      if (min === null) {
        sole = max;
      } else if (max === null) {
        sole = min;
      }

      if (sole !== false) {
        message_store.set(element,
          sprintf(_('Please select a valid value. The nearest valid value is %s.'),
                  sole));
      } else {
        message_store.set(element,
          sprintf(_('Please select a valid value. The two nearest valid values are %s and %s.'),
                  min, max));
      }
    }

    return invalid;
  },

  tooLong: element => {
    const invalid = ! test_maxlength(element);

    if (invalid) {
      message_store.set(element,
        sprintf(_('Please shorten this text to %s characters or less (you are currently using %s characters).'),
                element.getAttribute('maxlength'), element.value.length));
    }

    return invalid;
  },

  tooShort: element => {
    const invalid = ! test_minlength(element);

    if (invalid) {
      message_store.set(element,
        sprintf(_('Please lengthen this text to %s characters or more (you are currently using %s characters).'),
                element.getAttribute('maxlength'), element.value.length));
    }

    return invalid;
  },

  typeMismatch: element => {
    const invalid = ! test_type(element);

    if (invalid) {
      let msg = _('Please use the appropriate format.');
      if (element.type === 'email') {
        if (element.hasAttribute('multiple')) {
          msg = _('Please enter a comma separated list of email addresses.');
        } else {
          msg = _('Please enter an email address.');
        }
      } else if (element.type === 'url') {
        msg = _('Please enter a URL.');
      }
      message_store.set(element, msg);
    }

    return invalid;
  },

  valueMissing: element => {
    const invalid = ! test_required(element);

    if (invalid) {
      let msg = _('Please fill out this field.');
      if (element.type === 'checkbox') {
        msg = _('Please check this box if you want to proceed.');
      } else if (element.type === 'radio') {
        msg = _('Please select one of these options.');
      } else if (element.type === 'file') {
        if (element.hasAttribute('multiple')) {
          msg = _('Please select one or more files.');
        } else {
          msg = _('Please select a file.');
        }
      } else if (element instanceof window.HTMLSelectElement) {
        msg = _('Please select an item in the list.');
      }
      message_store.set(element, msg);
    }

    return invalid;
  },

};


/**
 * TODO allow HTMLFieldSetElement, too
 */
var ValidityState = function(element) {
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
    get: (function(func) {
      return function() { return func(this.element); };
    })(validity_state_checkers[prop]),
    set: undefined,
  });
}

/**
 * the "valid" property calls all other validity checkers and returns true,
 * if all those return false.
 */
Object.defineProperty(ValidityStatePrototype, 'valid', {
  configurable: true,
  enumerable: true,
  get: function() {
    for (let prop in validity_state_checkers) {
      if (validity_state_checkers[prop](this.element)) {
        return false;
      }
    }
    return true;
  },
  set: undefined,
});


/**
 * publish a convenience function to replace the native element.validity
 */
ValidityState.install = installer('validity', {
  configurable: true,
  enumerable: true,
  value: function() { return new ValidityState(this); },
  writable: false,
});


export default ValidityState;
