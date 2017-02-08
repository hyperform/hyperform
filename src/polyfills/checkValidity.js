'use strict';


import return_hook_or from '../tools/return_hook_or';
import trigger_event from '../tools/trigger_event';
import ValidityState from './validityState';
import { get_wrapper } from '../components/wrapper';


/**
 * check an element's validity with respect to it's form
 */
const checkValidity = return_hook_or('checkValidity', function(element) {
  /* if this is a <form>, check validity of all child inputs */
  if (element instanceof window.HTMLFormElement) {
    return (
             Array.prototype.map.call(element.elements, checkValidity)
           ).every(b=>b);
  }

  /* default is true, also for elements that are no validation candidates */
  const valid = ValidityState(element).valid;
  if (valid) {
    const wrapped_form = get_wrapper(element);
    if (wrapped_form && wrapped_form.settings.validEvent) {
      trigger_event(element, 'valid');
    }
  } else {
    trigger_event(element, 'invalid', { cancelable: true });
  }

  return valid;
});


export default checkValidity;
