'use strict';


/**
 * generate a random ID
 *
 * @see https://gist.github.com/gordonbrander/2230317
 */
export default function(prefix='hf_') {
  return prefix + Math.random().toString(36).substr(2);
}
