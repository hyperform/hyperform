'use strict';


/**
 * get previous and next valid values for a stepped input element
 *
 * TODO add support for date, time, ...
 */
export default function(element, n=1) {
  const min = Number(element.getAttribute('min') || 0);
  const max = Number(element.getAttribute('max') || 100);
  const step = Number(element.getAttribute('step') || 1);
  const value = Number(element.value || 0);

  var prev = min + Math.floor((value - min) / step) * step * n;
  var next = min + (Math.floor((value - min) / step) + 1) * step * n;

  if (prev < min) {
    prev = null;
  } else if (prev > max) {
    prev = max;
  }

  if (next > max) {
    next = null;
  } else if (next < min) {
    next = min;
  }

  return [prev, next];
}
