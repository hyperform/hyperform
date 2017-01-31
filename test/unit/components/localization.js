'use strict';

import test from 'ava';
import { add_translation, set_language, default as _ } from '../../../src/components/localization';

test('localization', t => {
  set_language('fi');

  let canary = 'Never translate this string! #+*~';
  t.is(_(canary), canary);

  add_translation('fi', { '#__testing__': canary+canary, });
  t.is(_(canary), canary);
  t.is(_('#__testing__'), canary+canary);

  set_language('bar');
  t.is(_('#__testing__'), '#__testing__');

  add_translation('en', { '#__testing__': canary+canary, });
  t.is(_('#__testing__'), canary+canary);
});
