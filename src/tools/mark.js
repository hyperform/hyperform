'use strict';

/**
 * mark an object with a 'hyperform=true' property
 *
 * We use this to distinguish our properties from the native ones. Usage:
 * js> mark(obj);
 * js> assert(obj.hyperform === true)
 */
export default function(obj) {
  if (['object', 'function'].indexOf(typeof obj) > -1) {
    delete obj.hyperform;
    Object.defineProperty(obj, 'hyperform', {
      value: true,
    });
  }

  return obj;
}
