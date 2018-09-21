'use strict';


import { get_wrapper } from '../components/wrapper';


/**
 * add `property` to an element
 *
 * ATTENTION! This function will search for an equally named property on the
 * *prototype* of an element, if element is a concrete DOM node. Do not use
 * it as general-purpose property installer.
 *
 * js> installer(element, 'foo', { value: 'bar' });
 * js> assert(element.foo === 'bar');
 */
export default function(element, property, descriptor) {
  descriptor.configurable = true;
  descriptor.enumerable = true;
  if ('value' in descriptor) {
    descriptor.writable = true;
  }

  /* on concrete instances, i.e., <input> elements, the naive lookup
   * yields undefined. We have to look on its prototype then. On elements
   * like the actual HTMLInputElement object the first line works. */
  let original_descriptor = Object.getOwnPropertyDescriptor(element, property);
  if (original_descriptor === undefined) {
    original_descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), property);
  }

  if (original_descriptor) {

    if (original_descriptor.configurable === false) {
      /* Safari <= 9 and PhantomJS will end up here :-( Nothing to do except
       * warning */
      const wrapper = get_wrapper(element);
      if (wrapper && wrapper.settings.debug) {
        /* global console */
        console.log('[hyperform] cannot install custom property '+property);
      }
      return false;
    }

    /* we already installed that property... */
    if ((original_descriptor.get && original_descriptor.get.__hyperform) ||
        (original_descriptor.value && original_descriptor.value.__hyperform)) {
      return;
    }

    /* publish existing property under new name, if it's not from us */
    Object.defineProperty(
      element,
      '_original_'+property,
      original_descriptor
    );
  }

  delete element[property];
  Object.defineProperty(element, property, descriptor);

  return true;
}
