'use strict';


/**
 * patch String.length to account for non-BMP characters
 *
 * @see https://mathiasbynens.be/notes/javascript-unicode
 */
export default function(str) {
  return [...str].length;
}
