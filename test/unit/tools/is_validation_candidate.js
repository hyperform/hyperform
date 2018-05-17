'use strict';

import test from 'ava';
import is_validation_candidate from '../../../src/tools/is_validation_candidate';

/* context: issue #77 */
test('respect noValidate property and novalidate attribute on elements', t => {
  var dummy = document.createElement('input');
  dummy.name = 'test';
  dummy.required = true;
  t.is(is_validation_candidate(dummy), true);
  dummy.noValidate = true;
  t.is(is_validation_candidate(dummy), false);
  dummy.setAttribute('novalidate', '');
  t.is(is_validation_candidate(dummy), false);
  delete(dummy.noValidate);
  t.is(is_validation_candidate(dummy), false);
  dummy.removeAttribute('novalidate');
  t.is(is_validation_candidate(dummy), true);
});
