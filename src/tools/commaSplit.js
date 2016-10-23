'use strict';


import trim from './trim';


/**
 * split a string on comma and trim the components
 *
 * As specified at
 * https://html.spec.whatwg.org/multipage/infrastructure.html#split-a-string-on-commas
 * plus removing empty entries.
 */
export default function(str) {
  return str.split(',')
            .map(item => trim(item))
            .filter(b=>b);
}
