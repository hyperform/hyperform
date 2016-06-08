'use strict';


/**
 * remove `property` from element and restore _original_property, if present
 */
export default function(element, property) {
  delete element[property];

  const original_descriptor = Object.getOwnPropertyDescriptor(element,
                                '_original_'+property);

  if (original_descriptor) {
    Object.defineProperty(element, property, original_descriptor);
  }

}
