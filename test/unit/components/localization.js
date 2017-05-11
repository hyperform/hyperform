'use strict';

import test from 'ava';
import { add_translation, set_language, default as _ } from '../../../src/components/localization';

test('localization', t => {
  set_language('fi');

  let canary = 'Never translate this string! #+*~';

  // return string unchanged
  t.is(_(canary), canary);

  add_translation('fi', { '#__testing__': canary+canary, });

  // return base string still unchanged, but
  t.is(_(canary), canary);
  // translate the testing string
  t.is(_('#__testing__'), canary+canary);

  set_language('fi-ZH');
  // return the base lang translation, if it exists
  t.is(_('#__testing__'), canary+canary);

  set_language('bar');
  // return the testing string after switching language
  t.is(_('#__testing__'), '#__testing__');

  add_translation('en', { '#__testing__': canary+canary+canary, });
  // return the english default, when it exists
  t.is(_('#__testing__'), canary+canary+canary);
});
