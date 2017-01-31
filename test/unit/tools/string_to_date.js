'use strict';

import test from 'ava';
import string_to_date from '../../../src/tools/string_to_date';

test('string_to_date', t => {
  t.is(+string_to_date('2015-01-01T01:23:45', 'datetime'),
       +(new Date(Date.UTC(2015, 0, 1, 1, 23, 45))));
  t.is(+string_to_date('2015-01-01', 'date'),
       +(new Date(Date.UTC(2015, 0, 1))));
  t.is(+string_to_date('2015-01', 'month'),
       +(new Date(Date.UTC(2015, 0, 1))));
  t.is(+string_to_date('2015-W01', 'week'),
       +(new Date(Date.UTC(2014, 11, 29))));
  t.is(+string_to_date('01:23:45', 'time'),
       +(new Date(Date.UTC(1970, 0, 1, 1, 23, 45))));
  t.is(string_to_date('bar', 'datetime'), null);
  t.is(string_to_date('foo', 'time'), null);
  t.is(string_to_date('2015-01-01', 'text'), null);
});
