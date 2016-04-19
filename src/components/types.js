'use strict';

/* and datetime-local? Spec says “Nah!” */
export const dates = [ 'datetime', 'date', 'month', 'week', 'time', ];

export const plain_numbers = [ 'number', 'range', ];

/* everything that returns something meaningful for valueAsNumber and
 * can have the step attribute */
export const numbers = dates.concat(plain_numbers, 'datetime-local');

/* the spec says to only check those for syntax in validity.typeMismatch.
 * ¯\_(ツ)_/¯ */
export const type_checked = [ 'email', 'url', ];

export const text = [ 'text', 'search', 'tel', 'password', ].concat(type_checked);

/* input element types, that are candidates for the validation API.
 * Missing from this set are: button, hidden, menu (from <button>), reset */
export const validation_candidates = [ 'checkbox', 'color', 'file', 'image',
  'radio', 'submit', ].concat(numbers, text);
