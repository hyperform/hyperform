'use strict';


/**
 * remove `property` from element and restore _original_property, if present
 */
export default function(element, property) {
  delete element[property];

  const originalDescriptor = Object.getOwnPropertyDescriptor(element,
                                '_original_'+property);

  if (originalDescriptor) {
    Object.defineProperty(element, property, originalDescriptor);
  }

}
