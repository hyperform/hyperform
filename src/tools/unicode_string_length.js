'use strict';


/**
 * patch String.length to account for non-BMP characters
 *
 * @see https://mathiasbynens.be/notes/javascript-unicode
 * We do not use the simple [...str].length, because it needs a ton of
 * polyfills in older browsers.
 */
export default function(str) {
  return str.match(/[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g).length;
}
