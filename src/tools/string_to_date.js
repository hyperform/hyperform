'use strict';


/**
 * calculate a date from a string according to HTML5
 */
export default function(string, element_type) {
  var date = new Date(0);
  switch (element_type) {
    case 'date':
      if (! /^([0-9]{4,})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(string)) {
        return null;
      }
      date.setFullYear(Number(RegExp.$1));
      date.setUTCMonth(Number(RegExp.$2) - 1,
                       Number(RegExp.$3));
      return date;

    case 'month':
      if (! /^([0-9]{4,})-(0[1-9]|1[012])$/.test(string)) {
        return null;
      }
      date.setFullYear(Number(RegExp.$1));
      date.setUTCMonth(Number(RegExp.$2) - 1, 1);
      return date;

    case 'week':
      if (! /^([0-9]{4,})-W(0[1-9]|[1234][0-9]|5[0-3])$/.test(string)) {
        return null;
      }
      date.setFullYear(Number(RegExp.$1));
      let weekday = (date.getUTCDay() || 7) - 1;
      /* get the monday of the week by subtracting current weekday from number
       * of days to set */
      date.setUTCDate(Number(RegExp.$2) * 7 - weekday);
      return date;

    case 'time':
      if (! /^([01][0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9])(?:\.([0-9]{1,3}))?)?$/.test(string)) {
        return null;
      }
      date.setUTCHours(Number(RegExp.$1), Number(RegExp.$2),
          Number(RegExp.$3 || 0), Number(RegExp.$4 || 0));
      return date;
  }

  return null;
}
