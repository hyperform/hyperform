'use strict';


import mark from '../tools/mark';
import installer from '../tools/property_installer';
import trigger_event from '../tools/trigger_event';
import ValidityState from './validityState';
import Wrapper from '../components/wrapper';


/**
 * check an element's validity with respect to it's form
 */
function checkValidity(element) {
  /* if this is a <form>, check validity of all child inputs */
  if (element instanceof window.HTMLFormElement) {
    return Array.prototype.every.call(element.elements, checkValidity);
  }

  /* default is true, also for elements that are no validation candidates */
  var valid = ValidityState(element).valid;
  if (valid) {
    const wrapped_form = Wrapper.get_wrapped(element.form);
    if (wrapped_form && wrapped_form.settings.valid_event) {
      trigger_event(element, 'valid');
    }
  } else {
    trigger_event(element, 'invalid', { cancelable: true });
  }

  return valid;
}


/**
 * publish a convenience function to replace the native element.checkValidity
 */
checkValidity.install = installer('checkValidity', {
  configurable: true,
  enumerable: true,
  value: function() { return checkValidity(this); },
  writable: true,
});

mark(checkValidity);

export default checkValidity;
