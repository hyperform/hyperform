'use strict';

import test from 'ava';
import { install_properties } from '../../../src/polyfills/properties';

test('properties', t => {
  var el = document.createElement('input');
  el.setAttribute('name', 'foo');
  install_properties(el);
  el.setAttribute('maxlength', '2');
  t.true(el.maxLength === 2);
  el.maxLength = 3;
  t.true(el.getAttribute('maxlength') === '3');

  el.setAttribute('pattern', 'a.*b');
  t.true(el.pattern === 'a.*b');
  el.pattern = 'b.+a';
  t.true(el.getAttribute('pattern') === 'b.+a');

  el.setAttribute('required', 'required');
  t.true(el.required === true);
  el.removeAttribute('required');
  t.false(el.required);
  el.required = true;
  t.true(el.getAttribute('required') === 'required');

  el.readOnly = true;
  t.true(el.getAttribute('readonly') === 'readonly');
});
