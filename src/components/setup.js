'use strict';


import { catch_submit, uncatch_submit } from '../tools/catch_submit';
import ValidityState from '../polyfills/validityState';
import reportValidity from '../polyfills/reportValidity';
import polyfill from '../tools/polyfill';
import polyunfill from '../tools/polyunfill';


const element_prototypes = [
  window.HTMLButtonElement.prototype,
  window.HTMLInputElement.prototype,
  window.HTMLSelectElement.prototype,
  window.HTMLTextAreaElement.prototype,
  window.HTMLFieldSetElement.prototype,
];


/**
 * get the appropriate function to revalidate form elements
 */
function get_revalidator(method='hybrid') {
  return function(event) {
    if (event.target instanceof window.HTMLButtonElement ||
        event.target instanceof window.HTMLTextAreaElement ||
        event.target instanceof window.HTMLSelectElement ||
        event.target instanceof window.HTMLInputElement) {

      if (event.target.form && event.target.form.hasAttribute('novalidate')) {
        /* do nothing, if the form forbids it. This still allows manual
         * validation via, e.g., input.reportValidity(), but mirrors browser
         * behavior, that are also completely silent in this case. */
        return;
      }

      if (method === 'hybrid') {
        /* "hybrid" somewhat simulates what browsers do. See for example
         * Firefox's :-moz-ui-invalid pseudo-class:
         * https://developer.mozilla.org/en-US/docs/Web/CSS/:-moz-ui-invalid */
        if (event.type === 'blur' &&
            event.target.value !== event.target.defaultValue ||
            ValidityState(event.target).valid) {
          /* on blur, update the report when the value has changed from the
           * default or when the element is valid (possibly removing a still
           * standing invalidity report). */
          reportValidity(event.target);
        } else if ((event.type === 'keyup' && event.keyCode !== 9) ||
                    event.type === 'change') {
          if (ValidityState(event.target).valid) {
            // report instantly, when an element becomes valid,
            // postpone report to blur event, when an element is invalid
            reportValidity(event.target);
          }
        }

      } else if (event.type !== 'keyup' || event.keyCode !== 9) {
        /* do _not_ validate, when the user "tabbed" into the field initially,
         * i.e., a keyup event with keyCode 9 */
        reportValidity(event.target);
      }

    }
  };
}


/**
 * run a function on all found elements
 */
function execute_on_elements(fn, elements) {
  if (elements instanceof window.Element) {
    elements = [ elements ];
  }

  const elements_length = elements.length;

  for (let i = 0; i < elements_length; i++) {
    fn(elements[i]);
  }
}


/**
 * get a function, that removes hyperform behavior again
 */
function get_destructor(hform) {
  const form = hform.form;
  return function() {
    uncatch_submit(form);
    form.removeEventListener('keyup', hform.revalidator);
    form.removeEventListener('change', hform.revalidator);
    form.removeEventListener('blur', hform.revalidator, true);
    if (form === window || form.nodeType === 9) {
      hform.uninstall(element_prototypes);
      polyunfill(window.HTMLFormElement);
    } else if (form instanceof window.HTMLFormElement ||
               form instanceof window.HTMLFieldSetElement) {
      hform.uninstall(form.elements);
      if (form instanceof window.HTMLFormElement) {
        polyunfill(form);
      }
    } else if (form instanceof window.HTMLElement) {
      hform.observer.disconnect();
      for (let subform of Array.prototype.slice.call(form.getElementsByTagName('form'))) {
        hform.uninstall(subform.elements);
        polyunfill(subform);
      }
    }
  };
}


/**
 * add hyperform behavior to a freshly initialized wrapper
 */
export function add_behavior(hform) {
  const form = hform.form;
  const settings = hform.settings;

  hform.revalidator = get_revalidator(settings.revalidate);
  hform.observer = { disconnect() {} };

  hform.install = elements => execute_on_elements(polyfill, elements);
  hform.uninstall = elements => execute_on_elements(polyunfill, elements);

  hform._destruct = get_destructor(hform);

  catch_submit(form, settings.revalidate === 'never');

  if (form === window || form.nodeType === 9) {
    /* install on the prototypes, when called for the whole document */
    hform.install(element_prototypes);
    polyfill(window.HTMLFormElement);
  } else if (form instanceof window.HTMLFormElement ||
             form instanceof window.HTMLFieldSetElement) {
    hform.install(form.elements);
    if (form instanceof window.HTMLFormElement) {
      polyfill(form);
    }
  } else if (form instanceof window.HTMLElement) {
    for (let subform of Array.prototype.slice.call(hform.form.getElementsByTagName('form'))) {
      hform.install(subform.elements);
      polyfill(subform);
    }
    hform.observer = new window.MutationObserver(mutationsList => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          for (let subform of Array.prototype.slice.call(mutation.addedNodes)) {
            if (subform instanceof window.HTMLFormElement) {
              hform.install(subform.elements);
              polyfill(subform);
            }
          }
          for (let subform of Array.prototype.slice.call(mutation.removedNodes)) {
            if (subform instanceof window.HTMLFormElement) {
              hform.uninstall(subform.elements);
              polyunfill(subform);
            }
          }
        }
      }
    });
    hform.observer.observe(form, {subtree: true, childList: true});
  } else {
    throw new Error('Hyperform must be used with a node or window.');
  }

  if (settings.revalidate === 'oninput' || settings.revalidate === 'hybrid') {
    /* in a perfect world we'd just bind to "input", but support here is
     * abysmal: http://caniuse.com/#feat=input-event */
    form.addEventListener('keyup', hform.revalidator);
    form.addEventListener('change', hform.revalidator);
  }
  if (settings.revalidate === 'onblur' || settings.revalidate === 'hybrid') {
    /* useCapture=true, because `blur` doesn't bubble. See
     * https://developer.mozilla.org/en-US/docs/Web/Events/blur#Event_delegation
     * for a discussion */
    form.addEventListener('blur', hform.revalidator, true);
  }
}
