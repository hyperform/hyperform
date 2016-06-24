'use strict';


import uninstall_property from '../tools/property_uninstaller';


export default function(element) {
  if (element instanceof window.HTMLButtonElement ||
      element instanceof window.HTMLInputElement ||
      element instanceof window.HTMLSelectElement ||
      element instanceof window.HTMLTextAreaElement ||
      element instanceof window.HTMLFieldSetElement) {

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

    // TODO uninstall other properties

  } else if (element instanceof window.HTMLFormElement) {
    uninstall_property(element, 'checkValidity');
    uninstall_property(element, 'reportValidity');
  }
}
