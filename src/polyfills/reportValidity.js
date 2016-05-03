'use strict';


import mark from '../tools/mark';
import installer from '../tools/property_installer';
import trigger_event from '../tools/trigger_event';
import renderer from '../components/renderer';
import ValidityState from './validityState';


/**
 * check element's validity and report an error back to the user
 */
function reportValidity() {
  /* jshint -W040 */

  /* if this is a <form>, report validity of all child inputs */
  if (this instanceof window.HTMLFormElement) {
    return Array.prototype.every.call(this.elements, reportValidity);
  }

  /* we copy checkValidity() here, b/c we have to check if the "invalid"
   * event was canceled. */
  var valid = ValidityState(this).valid;
  if (! valid) {
    const event = trigger_event(this, 'invalid', { cancelable: true });
    if (! event.defaultPrevented) {
      renderer.show_warning(this);
    }
  }
  /* jshint +W040 */
  return valid;
}


/**
 * publish a convenience function to replace the native element.reportValidity
 */
reportValidity.install = installer('reportValidity', {
  configurable: true,
  enumerable: true,
  value: reportValidity,
  writable: true,
});

mark(reportValidity);

export default reportValidity;
