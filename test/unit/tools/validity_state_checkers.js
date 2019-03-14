'use strict';

import test from 'ava';
import validity_state_checkers from '../../../src/tools/validity_state_checkers';

const valid = validity_state_checkers.valid;

function get_dummy(type, value) {
  var dummy = document.createElement('input');
  dummy.type = type;
  dummy.value = value;
  return dummy;
}

test('valid set class hf_user_invalid', t => {
  var dummy = get_dummy('checkbox', 'abc');
  t.is(valid(dummy), true);
  t.notRegex(dummy.className, /hf-user-invalid/);
  dummy.required = true;
  t.is(valid(dummy), false);
  t.regex(dummy.className, /hf-user-invalid/);
  dummy.type = 'text';
  dummy.setAttribute('value', 'abc');
  t.is(valid(dummy), true);
  t.notRegex(dummy.className, /hf-user-invalid/);
  dummy.value = '';
  t.is(valid(dummy), false);
  t.regex(dummy.className, /hf-user-invalid/);
});
