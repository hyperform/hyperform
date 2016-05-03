'use strict';


import mark from '../tools/mark';
import installer from '../tools/property_installer';
import trigger_event from '../tools/trigger_event';
import ValidityState from './validityState';


/**
 * check an element's validity with respect to it's form
 */
function checkValidity() {
  /* jshint -W040 */

  /* if this is a <form>, check validity of all child inputs */
  if (this instanceof window.HTMLFormElement) {
    return Array.prototype.every.call(this.elements, checkValidity);
  }

  /* default is true, also for elements that are no validation candidates */
  var valid = ValidityState(this).valid;
  if (! valid) {
    trigger_event(this, 'invalid', { cancelable: true });
  }
  /* jshint +W040 */

  return valid;
}


/**
 * publish a convenience function to replace the native element.checkValidity
 */
checkValidity.install = installer('checkValidity', {
  configurable: true,
  enumerable: true,
  value: checkValidity,
  writable: true,
});

mark(checkValidity);

export default checkValidity;
