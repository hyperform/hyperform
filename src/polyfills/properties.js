'use strict';


import install_property from '../tools/property_installer';
import uninstall_property from '../tools/property_uninstaller';
import { call_hook, do_filter } from '../components/hooks';


const gA = prop => function() {
  return do_filter('attr_get_'+prop, this.getAttribute(prop), this);
};

const sA = prop => function(value) {
  this.setAttribute(prop, do_filter('attr_set_'+prop, value, this));
};

const gAb = prop => function() {
  return do_filter('attr_get_'+prop, this.hasAttribute(prop), this);
};

const sAb = prop => function(value) {
  if (do_filter('attr_set_'+prop, value, this)) {
    this.setAttribute(prop, prop);
  } else {
    this.removeAttribute(prop);
  }
};

const gAn = prop => function() {
  return do_filter('attr_get_'+prop, Math.max(0, Number(this.getAttribute(prop))), this);
};

const sAn = prop => function(value) {
  value = do_filter('attr_set_'+prop, value, this);
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
