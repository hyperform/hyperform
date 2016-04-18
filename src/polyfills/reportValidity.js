'use strict';


import mark from '../tools/mark';
import installer from '../tools/property_installer';
import renderer from '../components/renderer';
import checkValidity from './checkValidity';


/**
 * check element's validity and report an error back to the user
 */
function reportValidity() {
  /* jshint -W040 */

  /* if this is a <form>, check validity of all child inputs */
  if (this instanceof window.HTMLFormElement) {
    return Array.prototype.every.call(this.elements, reportValidity);
  }

  const valid = checkValidity.call(this);
  if (! valid) {
    /* TODO suppress warning, if checkValidity's invalid event is canceled. */
    renderer.show_warning(this);
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
