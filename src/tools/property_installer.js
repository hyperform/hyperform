'use strict';


export default function(property, descriptor) {
  return function(element) {
    delete element[property];
    Object.defineProperty(element, property, descriptor);
  };
}
