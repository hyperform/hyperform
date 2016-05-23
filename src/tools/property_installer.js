'use strict';


/**
 * return a function, that adds `property` to an element
 *
 * js> installer('foo', { value: 'bar' })(element);
 * js> assert(element.foo === 'bar');
 */
export default function(property, descriptor) {
  return function(element) {
    const original_descriptor = Object.getOwnPropertyDescriptor(element, property);

    if (original_descriptor) {

      /* we already installed that property... */
      if ((original_descriptor.get && original_descriptor.get.__hyperform) ||
          (original_descriptor.value && original_descriptor.value.__hyperform)) {
        return;
      }

      /* publish existing property under new name, if it's not from us */
      Object.defineProperty(
        element,
        '_original_'+property,
        original_descriptor
      );
    }

    delete element[property];
    Object.defineProperty(element, property, descriptor);
  };
}
