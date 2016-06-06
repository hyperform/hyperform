'use strict';


import message_store from './message_store';
import { get_wrapper } from './wrapper';
import generate_id from '../tools/generate_id';


const warnings_cache = new WeakMap();


const Renderer = {

  attach_warning: function(warning, element) {
    /* should also work, if element is last,
     * http://stackoverflow.com/a/4793630/113195 */
    element.parentNode.insertBefore(warning, element.nextSibling);
  },

  detach_warning: function(warning, element) {
    warning.parentNode.removeChild(warning);
  },

  show_warning: function(element, sub_radio=false) {
    const msg = message_store.get(element).toString();
    var warning = warnings_cache.get(element);

    if (msg) {
      if (! warning) {
        const wrapper = get_wrapper(element);
        warning = document.createElement('div');
        warning.className = wrapper && wrapper.settings.classes.warning || 'hf-warning';
        warning.id = generate_id();
        warning.setAttribute('aria-live', 'polite');
        warnings_cache.set(element, warning);
      }

      element.setAttribute('aria-errormessage', warning.id);
      warning.textContent = msg;
      Renderer.attach_warning(warning, element);

    } else if (warning && warning.parentNode) {
      element.removeAttribute('aria-errormessage');
      Renderer.detach_warning(warning, element);

    }

    if (! sub_radio && element.type === 'radio' && element.form) {
      /* render warnings for all other same-name radios, too */
      Array.prototype
        .filter.call(document.getElementsByName(element.name),
                     radio => radio.name === element.name &&
                              radio.form === element.form
        )
        .map(radio => Renderer.show_warning(radio, 'sub_radio'));
    }
  },

  set: function(renderer, action) {
    Renderer[renderer] = action;
  },

};


export default Renderer;
