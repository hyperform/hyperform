'use strict';


import message_store from './message_store';
import { get_wrapper } from './wrapper';
import generate_id from '../tools/generate_id';


const warningsCache = new WeakMap();


const DefaultRenderer = {

  /**
   * called when a warning should become visible
   */
  attachWarning: function(warning, element) {
    /* should also work, if element is last,
     * http://stackoverflow.com/a/4793630/113195 */

    /* make warnings line up horizontally with their elements (ex: when multiple elements are on the same line) */
    var leftMargin = element.offsetLeft - element.parentElement.offsetLeft;
    warning.style['margin-left'] = leftMargin + 'px';

    element.parentNode.insertBefore(warning, element.nextSibling);
  },

  /**
   * called when a warning should vanish
   */
  detachWarning: function(warning, element) {
    warning.parentNode.removeChild(warning);
  },

  /**
   * called when feedback to an element's state should be handled
   *
   * i.e., showing and hiding warnings
   */
  showWarning: function(element, sub_radio=false) {
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
      warning.textContent = msg;
      Renderer.attachWarning(warning, element);

    } else if (warning && warning.parentNode) {
      element.removeAttribute('aria-errormessage');
      Renderer.detachWarning(warning, element);

    }

    if (! sub_radio && element.type === 'radio' && element.form) {
      /* render warnings for all other same-name radios, too */
      Array.prototype
        .filter.call(document.getElementsByName(element.name),
                     radio => radio.name === element.name &&
                              radio.form === element.form
        )
        .map(radio => Renderer.showWarning(radio, 'sub_radio'));
    }
  },

};


const Renderer = {

  attachWarning: DefaultRenderer.attachWarning,
  detachWarning: DefaultRenderer.detachWarning,
  showWarning: DefaultRenderer.showWarning,

  set: function(renderer, action) {
    if (renderer.indexOf('_') > -1) {
      /* global console */
      // TODO delete before next non-patch version
      console.log('Renderer.set: please use camelCase names. '+renderer+' will be removed in the next non-patch release.');
      renderer = renderer.replace(/_([a-z])/g, g => g[1].toUpperCase());
    }
    if (! action) {
      action = DefaultRenderer[renderer];
    }
    Renderer[renderer] = action;
  },

};


export default Renderer;
