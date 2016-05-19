'use strict';


/**
 * counter that will be incremented with every call
 *
 * Will enforce uniqueness, as long as no more than 1 hyperform scripts
 * are loaded. (In that case we still have the "random" part below.)
 */
var uid = 0;


/**
 * generate a random ID
 *
 * @see https://gist.github.com/gordonbrander/2230317
 */
export default function(prefix='hf_') {
  return prefix + ( uid++ ) + Math.random().toString(36).substr(2);
}
