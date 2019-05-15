'use strict';


import { message_store } from './message_store';
import { get_wrapper } from './wrapper';
import generate_id from '../tools/generate_id';
import { get_radiogroup } from '../tools/get_radiogroup';


const warningsCache = new WeakMap();


const DefaultRenderer = {

  /**
   * called when a warning should become visible
   */
  attachWarning: function(warning, element) {
    /* should also work, if element is last,
     * http://stackoverflow.com/a/4793630/113195 */
    element.parentNode.insertBefore(warning, element.nextSibling);
  },

  /**
   * called when a warning should vanish
   */
  detachWarning: function(warning, element) {
    /* be conservative here, since an overwritten attachWarning() might not
     * actually have attached the warning. */
    if (warning.parentNode) {
      warning.parentNode.removeChild(warning);
    }
  },

  /**
   * called when feedback to an element's state should be handled
   *
   * i.e., showing and hiding warnings
   */
  showWarning: function(element, whole_form_validated=false) {
    /* don't render error messages on subsequent radio buttons of the
     * same group. This assumes, that element.validity.valueMissing is the only
     * possible validation failure for radio buttons. */
    if (whole_form_validated && element.type === 'radio' &&
        get_radiogroup(element)[0] !== element) {
      return;
    }

    const msg = message_store.get(element).toString();
    var warning = warningsCache.get(element);

    if (msg) {
      if (! warning) {
        const wrapper = get_wrapper(element);
        warning = document.createElement('div');
        warning.className = wrapper && wrapper.settings.classes.warning || 'hf-warning';
        warning.id = generate_id();
        warning.setAttribute('aria-live', 'polite');
        warningsCache.set(element, warning);
      }

      element.setAttribute('aria-errormessage', warning.id);
      if (!element.hasAttribute('aria-describedby')) {
        element.setAttribute('aria-describedby', warning.id);
      }
      Renderer.setMessage(warning, msg, element);
      Renderer.attachWarning(warning, element);

    } else if (warning && warning.parentNode) {
      if (element.getAttribute('aria-describedby') === warning.id) {
        element.removeAttribute('aria-describedby');
      }
      element.removeAttribute('aria-errormessage');
      Renderer.detachWarning(warning, element);

    }
  },

  /**
   * set the warning's content
   *
   * Overwrite this method, if you want, e.g., to allow HTML in warnings
   * or preprocess the content.
   */
  setMessage: function(warning, message, element) {
    warning.textContent = message;
  }

};


const Renderer = {

  attachWarning: DefaultRenderer.attachWarning,
  detachWarning: DefaultRenderer.detachWarning,
  showWarning: DefaultRenderer.showWarning,
  setMessage: DefaultRenderer.setMessage,

  set: function(renderer, action) {
    if (! action) {
      action = DefaultRenderer[renderer];
    }
    Renderer[renderer] = action;
  },

  getWarning: element => warningsCache.get(element),

};


export default Renderer;
