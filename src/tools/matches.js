'use strict';

/* shim layer for the Element.matches method */

const ep = window.Element.prototype;
const native_matches = ep.matches ||
                       ep.matchesSelector ||
                       ep.msMatchesSelector ||
                       ep.webkitMatchesSelector;

export default function(element, selector) {
  return native_matches.call(element, selector);
}
