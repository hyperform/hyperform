'use strict';

import test from 'ava';
import mark from '../../../src/tools/mark';
import property_installer from '../../../src/tools/property_installer';

test('property_installer', t => {
  var ours = {},
      dummy = {
        foo: 'bar',
      };
  mark(ours);
  dummy.ours = ours

  property_installer(dummy, 'foo', {
    configurable: true,
    value: 'baz',
  });
  t.is(dummy.foo, 'baz');
});

test('property_installer on element', t => {
  var dummy = document.createElement('input');

  property_installer(dummy, 'name', {
    configurable: true,
    value: 'yay',
  });
  t.is(dummy.name, 'yay');
  t.not(dummy._original_name, undefined);
});
