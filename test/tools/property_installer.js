'use strict';

import test from 'ava';
import mark from '../../src/tools/mark';
import property_installer from '../../src/tools/property_installer';

test('property_installer', t => {
  var ours = {},
      dummy = {
        foo: 'bar',
      };
  mark(ours);
  dummy.ours = ours

  property_installer('foo', {
    value: 'baz',
  })(dummy);
  t.is(dummy.foo, 'baz');
  t.is(dummy._original_foo, 'bar');

  property_installer('ours', {
    value: 'yay',
  })(dummy);
  t.not(dummy.ours, ours);
  t.false('_original_ours' in dummy);
});
