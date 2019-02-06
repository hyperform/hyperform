'use strict';


import { get_radiogroup } from '../tools/get_radiogroup';


function has_submittable_option(select) {
  /* Definition of the placeholder label option:
   * https://www.w3.org/TR/html5/sec-forms.html#element-attrdef-select-required
   * Being required (the first constraint in the spec) is trivially true, since
   * this function is only called for such selects.
   */
  const has_placeholder_option = (
    ! select.multiple &&
    select.size <= 1 &&
    select.options.length > 0 &&
    select.options[0].parentNode == select &&
    select.options[0].value === ''
  );
  return (
    /* anything selected at all? That's redundant with the .some() call below,
     * but more performant in the most probable error case. */
    select.selectedIndex > -1 &&
    Array.prototype.some.call(
      select.options,
      option => {
        return (
          /* it isn't the placeholder option */
          (! has_placeholder_option || option.index !== 0) &&
          /* it isn't disabled */
          ! option.disabled &&
          /* and it is, in fact, selected */
          option.selected);
      }
    )
  );
}


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

  if (element instanceof window.HTMLSelectElement) {
    return has_submittable_option(element);
  }

  return (element.type === 'checkbox')? element.checked : (!! element.value);
}
