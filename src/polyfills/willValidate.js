'use strict';


import is_validation_candidate from '../tools/is_validation_candidate';


/**
 * check, if an element will be subject to HTML5 validation at all
 */
export default function willValidate(element) {
  return is_validation_candidate(element);
}
