'use strict';


/**
 * get previous and next valid values for a stepped input element
 *
 * TODO add support for date, time, ...
 */
export default function(element) {
  const min = Number(element.getAttribute(min) || 0);
  const max = Number(element.getAttribute(max) || 100);
  const step = Number(element.getAttribute(step) || 1);
  const value = Number(element.value || 0);
  var prev, next;

  prev = min + Math.floor((value - min) / step) * step;
  next = min + Math.floor((value - min) / step) * ( step + 1);

  if (prev < min) {
    prev = undefined;
  }

  if (next > max) {
    next = undefined;
  }

  return [prev, next];
}
