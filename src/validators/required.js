'use strict';


import { get_radiogroup } from '../tools/get_radiogroup';


/**
 * test the required attribute
 */
export default function(element) {
  if (element.type === 'radio') {
    /* the happy (and quick) path for radios: */
    if (element.hasAttribute('required') && element.checked) {
      return true;
    }

    const radiogroup = get_radiogroup(element);

    /* if any radio in the group is required, we need any (not necessarily the
     * same) radio to be checked */
    if (radiogroup.some(radio => radio.hasAttribute('required'))) {
      return radiogroup.some(radio => radio.checked);
    }
    /* not required, validation passes */
    return true;
  }

  if (! element.hasAttribute('required')) {
    /* nothing to do */
    return true;
  }

  return (element.type === 'checkbox')? element.checked : (!! element.value);
}
