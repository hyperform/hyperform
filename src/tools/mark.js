'use strict';

/**
 * mark an object with a '__hyperform=true' property
 *
 * We use this to distinguish our properties from the native ones. Usage:
 * js> mark(obj);
 * js> assert(obj.__hyperform === true)
 */
export default function(obj) {
  if (['object', 'function'].indexOf(typeof obj) > -1) {
    delete obj.__hyperform;
    Object.defineProperty(obj, '__hyperform', {
      configurable: true,
      enumerable: false,
      value: true,
    });
  }

  return obj;
}
