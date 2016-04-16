'use strict';


/**
 * return a new Date() representing the ISO date for a week number
 *
 * @see http://stackoverflow.com/a/16591175/113195
 */
export default function(week, year) {
  var date = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));

  if (date.getDay() <= 4/* thursday */) {
    date.setDate(date.getDate() - date.getDay() + 1);
  } else {
    date.setDate(date.getDate() + 8 - date.getDay());
  }

  return date;
}
