'use strict';


const ws_on_start_or_end = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;


/**
 * trim a string of whitespace
 *
 * We don't use String.trim() to remove the need to polyfill it.
 */
export default function(str) {
  return str.replace(ws_on_start_or_end, '');
}
