'use strict';

import test from 'ava';
import { addTranslation, setLanguage, default as l10n } from '../../src/components/localization';

test('localization', t => {
  setLanguage('fi');

  let canary = 'Never translate this string! #+*~';
  t.is(l10n(canary), canary);

  addTranslation('fi', { '#__testing__': canary+canary, });
  t.is(l10n(canary), canary);
  t.is(l10n('#__testing__'), canary+canary);

  setLanguage('bar');
  t.is(l10n('#__testing__'), '#__testing__');

  addTranslation('en', { '#__testing__': canary+canary, });
  t.is(l10n('#__testing__'), canary+canary);
});
