'use strict';


/**
 * test the pattern attribute
 */
export default function(element) {
  return (
      ! element.value
      ||
      ! element.hasAttribute('pattern')
      ||
      (new RegExp('^(?:'+ element.getAttribute('pattern') +')$')).test(element.value)
    );
}
