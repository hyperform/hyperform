'use strict';

import test from 'ava';
import type from '../../../src/validators/type';

test('validator-type others', t => {
  var el = document.createElement('input');
  el.name = 'foo';
  el.setAttribute('type', 'number');
  el.value = '10';
  t.is(type(el), true);
});

test('validator-type url', t => {
  var el = document.createElement('input');
  el.name = 'foo';
  el.setAttribute('type', 'url');
  el.value = 'foo';
  t.is(type(el), false);

  el.value = 'http://example.com';
  t.is(type(el), true);

  el.value = 'mailto:info@example.com';
  t.is(type(el), true);

  el.value = '';
  t.is(type(el), true);
});

test('validator-type email', t => {
  var el = document.createElement('input');
  el.name = 'foo';
  el.setAttribute('type', 'email');
  el.value = 'info@example.com';
  t.is(type(el), true);

  el.value = 'http://example.com';
  t.is(type(el), false);

  el.value = 'info@example.com,info@example.org';
  t.is(type(el), false);

  el.setAttribute('multiple', 'multiple');
  t.is(type(el), true);
});

test('validator-type file', t => {
  var el = document.createElement('input');
  el.name = 'foo';
  el.setAttribute('type', 'file');
  el.value = '';
  t.is(type(el), true);

  el.setAttribute('accept', '');
  t.is(type(el), true);

  el.setAttribute('accept', '  ,  ');
  t.is(type(el), true);

  el.setAttribute('accept', 'image/*,.pdf');
  t.is(type(el), true);

  Object.defineProperty(el, 'files', {
    value: [{
      type: 'video/mp4',
      name: 'funny.cat.video.mp4',
    },],
    writable: true,
  });
  t.is(type(el), false);

  el.files.push({
    type: 'image/png',
    name: 'funny.cat.image.png',
  });
  t.is(type(el), false);

  el.files.shift();
  t.is(type(el), true);
});
