'use strict';


export default function(str, ...args) {
  var args_length = args.length;

  for (let i = 0; i < args_length; i++) {
    let arg = args[i];
    if (arg instanceof Date ||
        typeof arg === 'number' ||
        arg instanceof Number) {
      /* try getting a localized representation of dates and numbers, if the
       * browser supports this */
      arg = (arg.toLocaleString || arg.toString).call(arg);
    }
    str = str.replace('%s', args[i]);
    str = str.replace(new RegExp('%'+(i+1)+'\\$s', 'g'), args[i]);
  }

  return str;
}
