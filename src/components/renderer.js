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
    let warning;
    let warning_element = element;
    let referring_elements = [element];

    if (element.type === 'radio') {
      const radiogroup = get_radiogroup(element);
      if (whole_form_validated && radiogroup[0] !== element) {
        /* don't render error messages on subsequent radio buttons of the
         * same group. This assumes, that element.validity.valueMissing is the only
         * possible validation failure for radio buttons, i.e., that there are
         * no individual validation problems on a single input. */
        return;
      } else {
        /* an existing warning should be removed. We need to look it up in
         * the cache with the right element, that is, with the first element
         * from the current radiogroup. */
        warning_element = radiogroup[0];
        referring_elements = radiogroup;
      }
    }
    warning = warningsCache.get(warning_element);

    const msg = message_store.get(warning_element).toString();

    if (msg) {
      if (! warning) {
        const wrapper = get_wrapper(warning_element);
        warning = document.createElement('div');
        warning.className = wrapper && wrapper.settings.classes.warning || 'hf-warning';
        warning.id = generate_id();
        warning.setAttribute('aria-live', 'polite');
        warningsCache.set(warning_element, warning);
      }

      referring_elements.forEach(el => {
        el.setAttribute('aria-errormessage', warning.id);
        if (!el.hasAttribute('aria-describedby')) {
          el.setAttribute('aria-describedby', warning.id);
        }
      });
      Renderer.setMessage(warning, msg, warning_element);
      Renderer.attachWarning(warning, warning_element);

    } else if (warning && warning.parentNode) {
      referring_elements.forEach(el => {
        if (el.getAttribute('aria-describedby') === warning.id) {
          el.removeAttribute('aria-describedby');
        }
        el.removeAttribute('aria-errormessage');
      });
      Renderer.detachWarning(warning, warning_element);

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
