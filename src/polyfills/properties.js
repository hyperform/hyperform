'use strict';


import installProperty from '../tools/propertyInstaller';
import uninstallProperty from '../tools/propertyUninstaller';
import { callHook, doFilter } from '../components/hooks';


const gA = prop => function() {
  return doFilter('attr_get_'+prop, this.getAttribute(prop), this);
};

const sA = prop => function(value) {
  this.setAttribute(prop, doFilter('attr_set_'+prop, value, this));
};

const gAb = prop => function() {
  return doFilter('attr_get_'+prop, this.hasAttribute(prop), this);
};

const sAb = prop => function(value) {
  if (doFilter('attr_set_'+prop, value, this)) {
    this.setAttribute(prop, prop);
  } else {
    this.removeAttribute(prop);
  }
};

const gAn = prop => function() {
  return doFilter('attr_get_'+prop, Math.max(0, Number(this.getAttribute(prop))), this);
};

const sAn = prop => function(value) {
  value = doFilter('attr_set_'+prop, value, this);
  if (/^[0-9]+$/.test(value)) {
    this.setAttribute(prop, value);
  }
};

function installProperties(element) {
  for (let prop of [ 'accept', 'max', 'min', 'pattern', 'placeholder', 'step', ]) {
    installProperty(element, prop, {
      get: gA(prop),
      set: sA(prop),
    });
  }

  for (let prop of [ 'multiple', 'required', 'readOnly', ]) {
    installProperty(element, prop, {
      get: gAb(prop.toLowerCase()),
      set: sAb(prop.toLowerCase()),
    });
  }

  for (let prop of [ 'minLength', 'maxLength', ]) {
    installProperty(element, prop, {
      get: gAn(prop.toLowerCase()),
      set: sAn(prop.toLowerCase()),
    });
  }
}

function uninstallProperties(element) {
  for (let prop of [ 'accept', 'max', 'min', 'pattern', 'placeholder', 'step',
       'multiple', 'required', 'readOnly', 'minLength', 'maxLength', ]) {
    uninstallProperty(element, prop);
  }
}

export { installProperties, uninstallProperties };
