'use strict';


import { callHook } from '../components/hooks.js';


/**
 * return either the data of a hook call or the result of action, if the
 * former is undefined
 *
 * @return function a function wrapper around action
 */
export default function(hook, action) {
  return function() {
    const data = callHook(hook, Array.prototype.slice.call(arguments));

    if (data !== undefined) {
      return data;
    }

    return action.apply(this, arguments);
  };
}
