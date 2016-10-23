'use strict';

/* and datetime-local? Spec says “Nah!” */
export const dates = [ 'datetime', 'date', 'month', 'week', 'time', ];

export const plainNumbers = [ 'number', 'range', ];

/* everything that returns something meaningful for valueAsNumber and
 * can have the step attribute */
export const numbers = dates.concat(plainNumbers, 'datetime-local');

/* the spec says to only check those for syntax in validity.typeMismatch.
 * ¯\_(ツ)_/¯ */
export const typeChecked = [ 'email', 'url', ];

/* check these for validity.badInput */
export const inputChecked = [ 'email', 'date', 'month', 'week', 'time',
  'datetime', 'datetime-local', 'number', 'range', 'color', ];

export const text = [ 'text', 'search', 'tel', 'password', ].concat(typeChecked);

/* input element types, that are candidates for the validation API.
 * Missing from this set are: button, hidden, menu (from <button>), reset and
 * the types for non-<input> elements. */
export const validationCandidates = [ 'checkbox', 'color', 'file', 'image',
  'radio', 'submit', ].concat(numbers, text);

/* all known types of <input> */
export const inputs = ['button', 'hidden', 'reset'].concat(validationCandidates);

/* apparently <select> and <textarea> have types of their own */
export const nonInputs = ['select-one', 'select-multiple', 'textarea'];
