'use strict';


/**
 * return a new Date() representing the ISO date for a week number
 *
 * @see http://stackoverflow.com/a/16591175/113195
 */
export default function(week, year) {
  const date = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));

  if (date.getUTCDay() <= 4/* thursday */) {
    date.setUTCDate(date.getUTCDate() - date.getUTCDay() + 1);
  } else {
    date.setUTCDate(date.getUTCDate() + 8 - date.getUTCDay());
  }

  return date;
}
