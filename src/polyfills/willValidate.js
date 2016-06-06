'use strict';


import mark from '../tools/mark';
import installer from '../tools/property_installer';
import is_validation_candidate from '../tools/is_validation_candidate';


/**
 * check, if an element will be subject to HTML5 validation
 */
function willValidate(element) {
  return is_validation_candidate(element);
}


/**
 * publish a convenience function to replace the native element.willValidate
 */
willValidate.install = installer('willValidate', {
  get: function() { return willValidate(this); },
});

mark(willValidate);

export default willValidate;
