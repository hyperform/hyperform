'use strict';


const wsOnStartOrEnd = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;


/**
 * trim a string of whitespace
 *
 * We don't use String.trim() to remove the need to polyfill it.
 */
export default function(str) {
  return str.replace(wsOnStartOrEnd, '');
}
