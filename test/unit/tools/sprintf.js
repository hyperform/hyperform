'use strict';

import test from 'ava';
import sprintf from '../../../src/tools/sprintf';

test('sprintf replace single argument', t => {
  t.is(sprintf('a%sc', 'b'), 'abc');
  t.is(sprintf('a%1$sc', 'b'), 'abc');
});

test('sprintf replace two arguments', t => {
  t.is(sprintf('a%sc%se', 'b', 'd'), 'abcde');
  t.is(sprintf('a%2$sc%1$se', 'b', 'd'), 'adcbe');
});

test('sprintf replace number', t => {
  var num = 12.34;
  t.is(sprintf('a%sb', num), 'a'+num.toString()+'b');
  t.is(sprintf('a%lb', num), 'a'+num.toLocaleString()+'b');
});

test('sprintf replace date', t => {
  var date = new Date();
  t.is(sprintf('a%sb', date), 'a'+date+'b');
  t.is(sprintf('a%lb', date), 'a'+date.toLocaleString()+'b');
});
