'use strict';


import get_date_from_week from './get_date_from_week';


/**
 * calculate a date from a string according to HTML5
 */
export default function(string, element_type) {
  let date;
  switch (element_type) {
    case 'datetime':
      if (! /^([0-9]{4})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9])(?:\.([0-9]{1,3}))?)?$/.test(string)) {
        return null;
      }
      date = new Date(string+'z');
      return isNaN(date.valueOf())? null : date;

    case 'date':
      if (! /^([0-9]{4})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(string)) {
        return null;
      }
      date = new Date(string);
      return isNaN(date.valueOf())? null : date;

    case 'month':
      if (! /^([0-9]{4})-(0[1-9]|1[012])$/.test(string)) {
        return null;
      }
      date = new Date(string);
      return isNaN(date.valueOf())? null : date;

    case 'week':
      if (! /^([0-9]{4})-W(0[1-9]|[1234][0-9]|5[0-3])$/.test(string)) {
        return null;
      }
      return get_date_from_week(Number(RegExp.$2), Number(RegExp.$1));

    case 'time':
      if (! /^([01][0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9])(?:\.([0-9]{1,3}))?)?$/.test(string)) {
        return null;
      }
      date = new Date('1970-01-01T'+string+'z');
      return date;
  }

  return null;
}
