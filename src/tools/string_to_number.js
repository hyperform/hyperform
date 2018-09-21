'use strict';


import string_to_date from './string_to_date';


/**
 * calculate a number from a string according to HTML5
 */
export default function(string, element_type) {
    const rval = string_to_date(string, element_type);
    if (rval !== null) {
      return +rval;
    }
    /* not parseFloat, because we want NaN for invalid values like "1.2xxy" */
    return Number(string);
}
