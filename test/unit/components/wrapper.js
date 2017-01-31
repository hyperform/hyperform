'use strict';

import test from 'ava';
import Wrapper from '../../../src/components/wrapper';

test('wrapper', t => {
  var form = document.createElement('form');
  var input = document.createElement('input');
  input.type = 'submit';
  form.appendChild(input);

  var wr = new Wrapper(form, {
    revalidate: 'oninput',
  });

  t.is(wr.settings.revalidate, 'oninput');
  t.is(wr.form, form);

  new Wrapper(form, {
    revalidate: 'onblur',
  });

  /* when a new wrapper for the same form is created, make sure the old
   * wrapper is updated instead. */
  t.is(wr.settings.revalidate, 'onblur');

  /* make sure the form.elements get the poylfills installed */
  let polyfill = Object.getOwnPropertyDescriptor(input, 'checkValidity');
  t.true(polyfill.value.__hyperform);

  wr.destroy();

  /* make sure the form.elements get the poylfills uninstalled */
  polyfill = Object.getOwnPropertyDescriptor(input, 'checkValidity');
  t.true(polyfill === undefined);
});
