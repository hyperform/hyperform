'use strict';


import { message_store } from '../components/message_store';
import Renderer from '../components/renderer';
import validity_state_checkers from '../tools/validity_state_checkers';


/**
 * set a custom validity message or delete it with an empty string
 */
export default function setCustomValidity(element, msg) {
  if (! msg) {
    message_store.delete(element, true);
  } else {
    message_store.set(element, msg, true);
  }
  /* live-update the warning */
  const warning = Renderer.getWarning(element);
  if (warning) {
    Renderer.setMessage(warning, msg, element);
  }
  /* update any classes if the validity state changes */
  validity_state_checkers.valid(element);
}
