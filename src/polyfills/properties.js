'use strict';


import install_property from '../tools/property_installer';
import uninstall_property from '../tools/property_uninstaller';


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
    install_property(element, prop, {
      get: gA(prop),
      set: sA(prop),
    });
  }

  for (let prop of [ 'multiple', 'required', 'readOnly', ]) {
    install_property(element, prop, {
      get: gAb(prop.toLowerCase()),
      set: sAb(prop.toLowerCase()),
    });
  }

  for (let prop of [ 'minLength', 'maxLength', ]) {
    install_property(element, prop, {
      get: gAn(prop.toLowerCase()),
      set: sAn(prop.toLowerCase()),
    });
  }
}

function uninstall_properties(element) {
  for (let prop of [ 'accept', 'max', 'min', 'pattern', 'placeholder', 'step',
       'multiple', 'required', 'readOnly', 'minLength', 'maxLength', ]) {
    uninstall_property(element, prop);
  }
}

export { install_properties, uninstall_properties };
