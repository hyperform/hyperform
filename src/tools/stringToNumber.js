'use strict';


import stringToDate from './stringToDate';


/**
 * calculate a date from a string according to HTML5
 */
export default function(string, elementType) {
    const rval = stringToDate(string, elementType);
    if (rval !== null) {
      return +rval;
    }
    /* not parseFloat, because we want NaN for invalid values like "1.2xxy" */
    return Number(string);
}
