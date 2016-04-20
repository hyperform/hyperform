'use strict';

import test from 'ava';
import property_installer from '../../src/tools/property_installer';

test('property_installer', t => {
  var dummy = {
    foo: 'bar',
  };
  property_installer('foo', {
    value: 'baz',
  })(dummy);
  t.is(dummy.foo, 'baz');
});
