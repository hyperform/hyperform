'use strict';

import test from 'ava';
import required from '../../../src/validators/required';

test('validator-required', t => {
  var el = document.createElement('input');
  el.name = 'foo';

  // missing attribute: do nothing.
  t.true(required(el));

  el.setAttribute('required', 'required');
  el.value = '';
  t.false(required(el));

  el.value = 'abc';
  t.true(required(el));

  el.type = 'checkbox';
  el.checked = false;
  t.false(required(el));
  el.checked = true;
  t.true(required(el));

  el.type = 'radio';
  el.checked = true;
  t.true(required(el));
  el.checked = false;
  t.false(required(el));
});
