'use strict';


import sprintf from './sprintf';
import getWeekOfYear from './getWeekOfYear';


function pad(num, size=2) {
  var s = num + '';
  while (s.length < size) {
    s = '0' + s;
  }
  return s;
}


/**
 * calculate a string from a date according to HTML5
 */
export default function dateToString(date, elementType) {
  if (! (date instanceof Date)) {
    return null;
  }

  switch (elementType) {
    case 'datetime':
      return dateToString(date, 'date') + 'T' +
             dateToString(date, 'time');

    case 'datetime-local':
      return sprintf('%s-%s-%sT%s:%s:%s.%s',
                     date.getFullYear(),
                     pad(date.getMonth() + 1),
                     pad(date.getDate()),
                     pad(date.getHours()),
                     pad(date.getMinutes()),
                     pad(date.getSeconds()),
                     pad(date.getMilliseconds(), 3)
                   ).replace(/(:00)?\.000$/, '');

    case 'date':
      return sprintf('%s-%s-%s',
                     date.getUTCFullYear(),
                     pad(date.getUTCMonth() + 1),
                     pad(date.getUTCDate()));

    case 'month':
      return sprintf('%s-%s', date.getUTCFullYear(),
                     pad(date.getUTCMonth() + 1));

    case 'week':
      const params = getWeekOfYear(date);
      return sprintf.call(null, '%s-W%s', params[0], pad(params[1]));

    case 'time':
      return sprintf('%s:%s:%s.%s',
                      pad(date.getUTCHours()),
                      pad(date.getUTCMinutes()),
                      pad(date.getUTCSeconds()),
                      pad(date.getUTCMilliseconds(), 3)
                    ).replace(/(:00)?\.000$/, '');
  }

  return null;
}
