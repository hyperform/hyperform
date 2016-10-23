'use strict';


import commaSplit from '../tools/commaSplit';
import getType from '../tools/getType';
import isValidationCandidate from '../tools/isValidationCandidate';
import trim from '../tools/trim';
import { typeChecked } from '../components/types';


/* we use a dummy <a> where we set the href to test URL validity
 * The definition is out of the "global" scope so that JSDOM can be instantiated
 * after loading Hyperform for tests.
 */
var urlCanary;

/* see https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address */
const emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * test the type-inherent syntax
 */
export default function(element) {
  const type = getType(element);

  if (! isValidationCandidate(element) ||
      (type !== 'file' && ! element.value) ||
      (type !== 'file' && typeChecked.indexOf(type) === -1)) {
    /* we're not responsible for this element */
    return true;
  }

  var isValid = true;

  switch (type) {
    case 'url':
        if (! urlCanary) {
          urlCanary = document.createElement('a');
        }
        const value = trim(element.value);
        urlCanary.href = value;
        isValid = (urlCanary.href === value ||
                    urlCanary.href === value+'/');
        break;
    case 'email':
        if (element.hasAttribute('multiple')) {
          isValid = commaSplit(element.value)
                       .every(value => emailPattern.test(value));
        } else {
          isValid = emailPattern.test(trim(element.value));
        }
        break;
    case 'file':
        if ('files' in element && element.files.length &&
            element.hasAttribute('accept')) {
          const patterns = commaSplit(element.getAttribute('accept'))
            .map(pattern => {
              if (/^(audio|video|image)\/\*$/.test(pattern)) {
                pattern = new RegExp('^'+RegExp.$1+'/.+$');
              }
              return pattern;
            });

          if (! patterns.length) {
            break;
          }

          fileloop:
          for (let i = 0; i < element.files.length; i++) {
            /* we need to match a whitelist, so pre-set with false */
            let fileValid = false;

            patternloop:
            for (let j = 0; j < patterns.length; j++) {
              const file = element.files[i];
              const pattern = patterns[j];

              let fileprop = file.type;

              if (typeof pattern === 'string' && pattern.substr(0, 1) === '.') {
                if (file.name.search('.') === -1) {
                  /* no match with any file ending */
                  continue patternloop;
                }

                fileprop = file.name.substr(file.name.lastIndexOf('.'));
              }

              if (fileprop.search(pattern) === 0) {
                /* we found one match and can quit looking */
                fileValid = true;
                break patternloop;
              }

            }

            if (! fileValid) {
              isValid = false;
              break fileloop;
            }
          }
        }
  }

  return isValid;
}
