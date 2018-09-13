'use strict';


/**
 * get all radio buttons (including `element`) that belong to element's
 * radio group
 */
export function get_radiogroup(element) {
  if (element.form) {
    return Array.prototype.filter.call(
      element.form.elements,
      radio => radio.type === 'radio' && radio.name === element.name
    );
  }
  return [element];
}
