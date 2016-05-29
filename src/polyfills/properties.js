'use strict';


function install_properties(element) {
  /* jshint -W083 */
  for (let prop of [ 'accept', 'max', 'min', 'pattern', 'placeholder', 'step', ]) {
    Object.defineProperty(element, prop, {
      configurable: true,
      enumerable: true,
      get: (prop => function() {
        return this.getAttribute(prop);
      })(prop),
      set: (prop => function(value) {
        this.setAttribute(prop, value);
      })(prop),
    });
  }

  for (let prop of [ 'multiple', 'required', 'readOnly', ]) {
    Object.defineProperty(element, prop, {
      configurable: true,
      enumerable: true,
      get: (prop => function() {
        return this.hasAttribute(prop);
      })(prop.toLowerCase()),
      set: (prop => function(value) {
        if (value) {
          this.setAttribute(prop, prop);
        } else {
          this.removeAttribute(prop, prop);
        }
      })(prop.toLowerCase()),
    });
  }

  for (let prop of [ 'minLength', 'maxLength', ]) {
    Object.defineProperty(element, prop, {
      configurable: true,
      enumerable: true,
      get: (prop => function() {
        return Math.max(0, Number(this.getAttribute(prop)));
      })(prop.toLowerCase()),
      set: (prop => function(value) {
        if (/^[0-9]+$/.test(value)) {
          this.setAttribute(prop, value);
        }
      })(prop.toLowerCase()),
    });
  }
  /* jshint +W083 */
}

export { install_properties };
