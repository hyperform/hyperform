'use strict';


import returnHookOr from '../tools/returnHookOr';
import triggerEvent from '../tools/triggerEvent';
import ValidityState from './validityState';
import { getWrapper } from '../components/wrapper';


/**
 * check an element's validity with respect to it's form
 */
const checkValidity = returnHookOr('checkValidity', function(element) {
  /* if this is a <form>, check validity of all child inputs */
  if (element instanceof window.HTMLFormElement) {
    return (
             Array.prototype.map.call(element.elements, checkValidity)
           ).every(b=>b);
  }

  /* default is true, also for elements that are no validation candidates */
  const valid = ValidityState(element).valid;
  if (valid) {
    const wrappedForm = getWrapper(element);
    if (wrappedForm && wrappedForm.settings.validEvent) {
      triggerEvent(element, 'valid');
    }
  } else {
    triggerEvent(element, 'invalid', { cancelable: true });
  }

  return valid;
});


export default checkValidity;
