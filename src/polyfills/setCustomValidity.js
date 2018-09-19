'use strict';


import { message_store } from '../components/message_store';
import Renderer from '../components/renderer';
import ValidityState from './validityState';


/**
 * set a custom validity message or delete it with an empty string
 */
export default function setCustomValidity(element, msg) {
  message_store.set(element, msg, true);
  /* live-update the warning */
  const warning = Renderer.getWarning(element);
  if (warning) {
    Renderer.setMessage(warning, msg, element);
  }
  /* update any classes if the validity state changes */
  ValidityState(element).valid;
}
