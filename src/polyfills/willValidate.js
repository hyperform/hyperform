'use strict';


import installer from '../tools/property_installer';
import { is_validation_candidate } from '../validators/common';


/**
 * TODO allow HTMLFieldSetElement, too
 */
function willValidate() {
  /* jshint -W040 */
  return is_validation_candidate(this);
  /* jshint +W040 */
}


/**
 * publish a convenience function to replace the native element.willValidate
 */
willValidate.install = installer('willValidate', {
  configurable: true,
  enumerable: true,
  get: willValidate,
  set: undefined,
});


export default willValidate;
