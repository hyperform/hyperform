'use strict';


import { inputs } from '../components/types';


/**
 * get the element's type in a backwards-compatible way
 */
export default function(element) {
  if (element instanceof window.HTMLTextAreaElement) {
    return 'textarea';

  } else if (element instanceof window.HTMLSelectElement) {
    return element.hasAttribute('multiple')? 'select-multiple' : 'select-one';

  } else if (element instanceof window.HTMLButtonElement) {
    return (element.getAttribute('type') || 'submit').toLowerCase();

  } else if (element instanceof window.HTMLInputElement) {
    const attr = (element.getAttribute('type') || '').toLowerCase();
    if (attr && inputs.indexOf(attr) > -1) {
      return attr;
    } else {
      /* perhaps the DOM has in-depth knowledge. Take that before returning
       * 'text'. */
      return element.type || 'text';
    }

  }

  return '';
}
