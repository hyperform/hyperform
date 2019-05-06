'use strict';


import { get_validated_elements } from '../tools/get_validated_elements';
import trigger_event from '../tools/trigger_event';
import Renderer from '../components/renderer';
import ValidityState from './validityState';
import { get_wrapper } from '../components/wrapper';


/**
 * check element's validity and report an error back to the user
 */
export default function reportValidity(element) {
  /* if this is a <form>, report validity of all child inputs */
  if (element instanceof window.HTMLFormElement) {
    element.__hf_form_validation = true;
    const form_valid = get_validated_elements(element).map(reportValidity).every(b=>b);
    delete(element.__hf_form_validation);
    return form_valid;
  }

  /* we copy checkValidity() here, b/c we have to check if the "invalid"
   * event was canceled. */
  const valid = ValidityState(element).valid;
  var event;
  if (valid) {
    const wrapped_form = get_wrapper(element);
    if (wrapped_form && wrapped_form.settings.validEvent) {
      event = trigger_event(element, 'valid', { cancelable: true });
    }
  } else {
    event = trigger_event(element, 'invalid', { cancelable: true });
  }

  if (! event || ! event.defaultPrevented) {
    Renderer.showWarning(element, (element.form && element.form.__hf_form_validation));
  }

  return valid;
}
