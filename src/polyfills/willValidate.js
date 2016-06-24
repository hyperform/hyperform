'use strict';


import mark from '../tools/mark';
import is_validation_candidate from '../tools/is_validation_candidate';


/**
 * check, if an element will be subject to HTML5 validation
 */
function willValidate(element) {
  return is_validation_candidate(element);
}

mark(willValidate);

export default willValidate;
