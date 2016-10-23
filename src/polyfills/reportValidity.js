'use strict';


import triggerEvent from '../tools/triggerEvent';
import Renderer from '../components/renderer';
import ValidityState from './validityState';
import { getWrapper } from '../components/wrapper';


/**
 * check element's validity and report an error back to the user
 */
export default function reportValidity(element) {
  /* if this is a <form>, report validity of all child inputs */
  if (element instanceof window.HTMLFormElement) {
    return (
             Array.prototype.map.call(element.elements, reportValidity)
           ).every(b=>b);
  }

  /* we copy checkValidity() here, b/c we have to check if the "invalid"
   * event was canceled. */
  const valid = ValidityState(element).valid;
  var event;
  if (valid) {
    const wrappedForm = getWrapper(element);
    if (wrappedForm && wrappedForm.settings.validEvent) {
      event = triggerEvent(element, 'valid', { cancelable: true });
    }
  } else {
    event = triggerEvent(element, 'invalid', { cancelable: true });
  }

  if (! event || ! event.defaultPrevented) {
    Renderer.showWarning(element);
  }

  return valid;
}
