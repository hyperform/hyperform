'use strict';


/**
 * return a function, that adds property to an element
 *
 * js> installer('foo', { value: 'bar' })(element);
 * js> assert(element.foo === 'bar');
 */
export default function(property, descriptor) {
  return function(element) {
    delete element[property];
    Object.defineProperty(element, property, descriptor);
  };
}
