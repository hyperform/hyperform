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

  property_installer(dummy, 'foo', {
    configurable: true,
    value: 'baz',
  });
  t.is(dummy.foo, 'baz');
  t.is(dummy._original_foo, 'bar');

  /* do not overwrite our own marked properties */
  property_installer(dummy, 'ours', {
    configurable: true,
    value: 'yay',
  });
  t.is(dummy.ours, ours);
  t.false('_original_ours' in dummy);
});
