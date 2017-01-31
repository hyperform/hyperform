'use strict';

import test from 'ava';
import date_to_string from '../../../src/tools/date_to_string';

test('date_to_string', t => {
  t.is('2015-01-01T01:23:45',
       date_to_string(new Date(Date.UTC(2015, 0, 1, 1, 23, 45)), 'datetime'));
  t.is('2015-01-01',
       date_to_string(new Date(Date.UTC(2015, 0, 1, 1, 23, 45)), 'date'));
  t.is('2015-01',
       date_to_string(new Date(Date.UTC(2015, 0, 1, 1, 23, 45)), 'month'));
  t.is('2015-W01',
       date_to_string(new Date(Date.UTC(2015, 0, 1, 1, 23, 45)), 'week'));
  t.is(date_to_string('bar', 'datetime'), null);
  t.is(date_to_string('foo', 'time'), null);
  t.is(date_to_string('2015-01-01', 'text'), null);
});
