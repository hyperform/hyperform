'use strict';

import test from 'ava';
import pattern from '../../../src/validators/pattern';

test('validator-pattern', t => {
  var el = document.createElement('input');
  el.name = 'foo';
  el.setAttribute('pattern', 'a.c');
  el.value = 'xyz';
  t.false(pattern(el));
  el.value = 'abc';
  t.true(pattern(el));
  // pattern must be anchored:
  el.value = 'xabcy';
  t.false(pattern(el));
});
