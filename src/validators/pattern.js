'use strict';

let canUnicode = true;
try {
  /* for old IEs downgrade to non-Unicode supporting regexps. This trades a
   * correct solution importing huge solutions like regexpu for wrong patterns
   * in a small number of cases for old, outdated browsers. */
  new RegExp('a', 'u');
} catch (e) {
  canUnicode = false;
}


/**
 * test the pattern attribute
 *
 * According to the spec, the "u" flag has to be set and regular expressions
 * are anchored (i.e. prepended with `^` and appended an `$`).
 */
export default function(element) {
  return (
      ! element.value
      ||
      ! element.hasAttribute('pattern')
      ||
      (new RegExp('^(?:'+ element.getAttribute('pattern') +')$'), canUnicode? 'u' : undefined).test(element.value)
    );
}
