'use strict';


import message_store from './message_store';
import { get_wrapper } from './wrapper';
import generate_id from '../tools/generate_id';


const warnings_cache = new WeakMap();


const DefaultRenderer = {

  /**
   * called when a warning should become visible
   */
  attach_warning: function(warning, element) {
			var wrapper = get_wrapper(element);
			var position = wrapper && wrapper.settings.attach_warning_position || 'default';

			switch(position) {

			  case 'default':
				  /* should also work, if element is last,
				   * http://stackoverflow.com/a/4793630/113195 */
				  element.parentNode.insertBefore(warning, element.nextSibling);
			      break;

			  case 'end':
				  element.parentNode.append(warning);
			      break;
			}
  },

  /**
   * called when a warning should vanish
   */
  detach_warning: function(warning, element) {
    warning.parentNode.removeChild(warning);
  },

  /**
   * called when feedback to an element's state should be handled
   *
   * i.e., showing and hiding warnings
   */
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

};


const Renderer = {

  attach_warning: DefaultRenderer.attach_warning,
  detach_warning: DefaultRenderer.detach_warning,
  show_warning: DefaultRenderer.show_warning,

  set: function(renderer, action) {
    if (! action) {
      action = DefaultRenderer[renderer];
    }
    Renderer[renderer] = action;
  },

};


export default Renderer;
