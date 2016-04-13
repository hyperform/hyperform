'use strict';


/**
 * calculate a number from a date according to HTML5
 *
 * @see https://html.spec.whatwg.org/multipage/forms.html#date-state-%28type=date%29:concept-input-value-string-number
 */
export default function(date) {
  if (! (date instanceof Date)) {
    date = Date.parse(date);
  }

  return date.getTime();
}
