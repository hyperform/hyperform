'use strict';


import is_field from './is_field';
import uninstall_property from './property_uninstaller';
import { uninstall_properties } from '../polyfills/properties';


export default function(element) {
  if (is_field(element)) {

    uninstall_property(element, 'checkValidity');
    uninstall_property(element, 'reportValidity');
    uninstall_property(element, 'setCustomValidity');
    uninstall_property(element, 'stepDown');
    uninstall_property(element, 'stepUp');
    uninstall_property(element, 'validationMessage');
    uninstall_property(element, 'validity');
    uninstall_property(element, 'valueAsDate');
    uninstall_property(element, 'valueAsNumber');
    uninstall_property(element, 'willValidate');

    uninstall_properties(element);

  } else if (element instanceof window.HTMLFormElement) {
    uninstall_property(element, 'checkValidity');
    uninstall_property(element, 'reportValidity');
  }
}
