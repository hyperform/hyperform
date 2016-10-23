'use strict';


import isField from './isField';
import uninstallProperty from './propertyUninstaller';
import { uninstallProperties } from '../polyfills/properties';


export default function(element) {
  if (isField(element)) {

    uninstallProperty(element, 'checkValidity');
    uninstallProperty(element, 'reportValidity');
    uninstallProperty(element, 'setCustomValidity');
    uninstallProperty(element, 'stepDown');
    uninstallProperty(element, 'stepUp');
    uninstallProperty(element, 'validationMessage');
    uninstallProperty(element, 'validity');
    uninstallProperty(element, 'valueAsDate');
    uninstallProperty(element, 'valueAsNumber');
    uninstallProperty(element, 'willValidate');

    uninstallProperties(element);

  } else if (element instanceof window.HTMLFormElement) {
    uninstallProperty(element, 'checkValidity');
    uninstallProperty(element, 'reportValidity');
  }
}
