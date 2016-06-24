'use strict';


const gA = prop => function() {
  return this.getAttribute(prop);
};

const sA = prop => function(value) {
  this.setAttribute(prop, value);
};

const gAb = prop => function() {
  return this.hasAttribute(prop);
};

const sAb = prop => function(value) {
  if (value) {
    this.setAttribute(prop, prop);
  } else {
    this.removeAttribute(prop);
  }
};

const gAn = prop => function() {
  return Math.max(0, Number(this.getAttribute(prop)));
};

const sAn = prop => function(value) {
  if (/^[0-9]+$/.test(value)) {
    this.setAttribute(prop, value);
  }
};

function install_properties(element) {
  for (let prop of [ 'accept', 'max', 'min', 'pattern', 'placeholder', 'step', ]) {
    Object.defineProperty(element, prop, {
      configurable: true,
      enumerable: true,
      get: gA(prop),
      set: sA(prop),
    });
  }

  for (let prop of [ 'multiple', 'required', 'readOnly', ]) {
    Object.defineProperty(element, prop, {
      configurable: true,
      enumerable: true,
      get: gAb(prop.toLowerCase()),
      set: sAb(prop.toLowerCase()),
    });
  }

  for (let prop of [ 'minLength', 'maxLength', ]) {
    Object.defineProperty(element, prop, {
      configurable: true,
      enumerable: true,
      get: gAn(prop.toLowerCase()),
      set: sAn(prop.toLowerCase()),
    });
  }
}

export { install_properties };
