'use strict';

import test from 'ava';
import mark from '../../src/tools/mark';

test('mark objects', t => {
  var dummy = function() {};
  mark(dummy);
  t.is(dummy.hyperform, true);
  t.is(Object.getOwnPropertyDescriptor(dummy, 'hyperform').writable, false);
  t.is(Object.getOwnPropertyDescriptor(dummy, 'hyperform').enumerable, false);
  dummy = { foo: 'bar' };
  mark(dummy);
  t.is(dummy.hyperform, true);
  t.is(Object.getOwnPropertyDescriptor(dummy, 'hyperform').writable, false);
  t.is(Object.getOwnPropertyDescriptor(dummy, 'hyperform').enumerable, false);
});

test('mark primitives', t => {
  var dummy = 'a';
  mark(dummy);
  t.is(dummy.hyperform, undefined);
  dummy = 123;
  mark(dummy);
  t.is(dummy.hyperform, undefined);
});
