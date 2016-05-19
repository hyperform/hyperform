'use strict';


import mark from '../tools/mark';
import installer from '../tools/property_installer';
import trigger_event from '../tools/trigger_event';
import renderer from '../components/renderer';
import ValidityState from './validityState';
import { get_wrapper } from '../components/wrapper';


/**
 * check element's validity and report an error back to the user
 */
function reportValidity(element) {
  /* if this is a <form>, report validity of all child inputs */
  if (element instanceof window.HTMLFormElement) {
    return (
             Array.prototype.map.call(element.elements, reportValidity)
           ).every(b=>b);
  }

  /* we copy checkValidity() here, b/c we have to check if the "invalid"
   * event was canceled. */
  var valid = ValidityState(element).valid;
  var event;
  if (valid) {
    const wrapped_form = get_wrapper(element);
    if (wrapped_form && wrapped_form.settings.valid_event) {
      event = trigger_event(element, 'valid', { cancelable: true });
    }
  } else {
    event = trigger_event(element, 'invalid', { cancelable: true });
  }

  if (! event || ! event.defaultPrevented) {
    renderer.show_warning(element);
  }

  return valid;
}


/**
 * publish a convenience function to replace the native element.reportValidity
 */
reportValidity.install = installer('reportValidity', {
  configurable: true,
  enumerable: true,
  value: function() { return reportValidity(this); },
  writable: true,
});

mark(reportValidity);

export default reportValidity;
