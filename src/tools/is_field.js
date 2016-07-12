'use strict';

export default function(element) {
  return (
          element instanceof window.HTMLButtonElement ||
          element instanceof window.HTMLInputElement ||
          element instanceof window.HTMLSelectElement ||
          element instanceof window.HTMLTextAreaElement ||
          element instanceof window.HTMLFieldSetElement ||
          element === window.HTMLButtonElement.prototype ||
          element === window.HTMLInputElement.prototype ||
          element === window.HTMLSelectElement.prototype ||
          element === window.HTMLTextAreaElement.prototype ||
          element === window.HTMLFieldSetElement.prototype
         );
}

