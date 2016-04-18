'use strict';

/**
 * mark an object with a 'hyperform=true' property
 *
 * We use this to distinguish our properties from the native ones. Usage:
 * js> obj.hyperform === true
 */
export default function(obj) {
  if (typeof obj !== 'object') {
    /* do it old style for primitive values */
    obj.hyperform = true;
  } else {
    Object.defineProperty(obj, 'hyperform', {
      value: true,
    });
  }

  return obj;
}
