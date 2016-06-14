'use strict';


export default function(str, ...args) {
  const args_length = args.length;
  var global_index = 0;

  return str.replace(/%([0-9]+\$)?([sl])/g, (match, position, type) => {
    var local_index = global_index;
    if (position) {
      local_index = Number(position.replace(/\$$/, '')) - 1;
    }
    global_index += 1;

    var arg = '';
    if (args_length > local_index) {
      arg = args[local_index];
    }

    if (arg instanceof Date ||
        typeof arg === 'number' ||
        arg instanceof Number) {
      /* try getting a localized representation of dates and numbers, if the
       * browser supports this */
      if (type === 'l') {
        arg = (arg.toLocaleString || arg.toString).call(arg);
      } else {
        arg = arg.toString();
      }
    }

    return arg;
  });
}
