'use strict';

import test from 'ava';
import mark from '../../src/tools/mark';
import propertyInstaller from '../../src/tools/propertyInstaller';

test('propertyInstaller', t => {
  var ours = {},
      dummy = {
        foo: 'bar',
      };
  mark(ours);
  dummy.ours = ours

  propertyInstaller(dummy, 'foo', {
    configurable: true,
    value: 'baz',
  });
  t.is(dummy.foo, 'baz');
  t.is(dummy._original_foo, 'bar');

  /* do not overwrite our own marked properties */
  propertyInstaller(dummy, 'ours', {
    configurable: true,
    value: 'yay',
  });
  t.is(dummy.ours, ours);
  t.false('_original_ours' in dummy);
});
