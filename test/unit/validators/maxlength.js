'use strict';

import test from 'ava';
import maxlength from '../../../src/validators/maxlength';

test('validator-maxlength', t => {
  var el = document.createElement('input');
  el.name = 'foo';

  el.setAttribute('maxlength', '2');
  el.value = '';
  t.is(maxlength(el), true);
  el.value = 'a';
  t.is(maxlength(el), true);
  el.value = 'aa';
  t.is(maxlength(el), true);
  el.value = 'aaa';
  t.is(maxlength(el), false);
  el.value = 'a\uD83D\uDD74';
  t.is(maxlength(el), true);

  el.setAttribute('maxlength', '');
  el.value = 'a';
  t.is(maxlength(el), true);

  el.setAttribute('maxlength', '0');
  el.value = 'a';
  t.is(maxlength(el), false);
  el.value = '';
  t.is(maxlength(el), true);

  el.setAttribute('type', 'date');
  el.setAttribute('maxlength', '2');
  el.value = '2015-01-01';
  t.is(maxlength(el), true);
});
