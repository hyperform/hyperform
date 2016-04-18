'use strict';

/* and datetime-local? Spec says “Nah!” */
export const dates = [ 'datetime', 'date', 'month', 'week', 'time', ];

export const plain_numbers = [ 'number', 'range', ];

export const numbers = dates.concat(plain_numbers, 'datetime-local');

export const text = [ 'text', 'search', 'url', 'tel', 'email', 'password', ];

/* missing from this set are: button, hidden, menu (from <button>), reset */
export const validation_candidates = [ 'checkbox', 'color', 'file', 'image',
  'radio', 'submit', ].concat(numbers, text);
