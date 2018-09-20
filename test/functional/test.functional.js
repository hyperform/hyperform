function make_hform(_doc, settings) {
  _doc = _doc || document;
  settings = settings || {};
  var form = _doc.createElement('form');
  form.innerHTML = '<input name="test" value="button_span">'+
                   '<button><span>submit</span></button>';
  var hform = _doc.defaultView.hyperform(form, settings);
  _doc.body.appendChild(form);
  return hform;
}


function destroy_hform(hform) {
  if (hform.form && hform.form.parentNode) {
    hform.form.parentNode.removeChild(hform.form);
  }
  hform.destroy();
}


describe('required radio buttons', function() {

  it('should work when alone', function() {
    var hform = make_hform();
    var form = hform.form;
    var input = form.getElementsByTagName('input')[0];
    input.type = 'radio';
    input.checked = false;
    if (input.validity.valueMissing) {
      throw Error('unrequired unchecked radio button should not be invalid');
    }
    input.checked = true;
    if (input.validity.valueMissing) {
      throw Error('unrequired checked radio button should not be invalid');
    }
    input.required = true;
    if (input.validity.valueMissing) {
      throw Error('required checked radio button should not be invalid');
    }
    input.checked = false;
    if (! input.validity.valueMissing) {
      throw Error('required unchecked radio button should be invalid');
    }
    destroy_hform(hform);
  });

  it('should work when detached from document', function() {
    var input = document.createElement('input');
    var validity = window.hyperform.ValidityState(input);
    input.type = 'radio';
    input.checked = false;
    if (validity.valueMissing) {
      throw Error('unrequired unchecked radio button should not be invalid');
    }
    input.checked = true;
    if (validity.valueMissing) {
      throw Error('unrequired checked radio button should not be invalid');
    }
    input.required = true;
    if (validity.valueMissing) {
      throw Error('required checked radio button should not be invalid');
    }
    input.checked = false;
    if (! validity.valueMissing) {
      throw Error('required unchecked radio button should be invalid');
    }
  });

  it('should work when part of a radio group', function() {
    var hform = make_hform();
    var form = hform.form;
    var input = form.getElementsByTagName('input')[0];
    input.type = 'radio';
    input.checked = false;
    form.insertBefore(input.cloneNode(), input);
    form.appendChild(input.cloneNode());
    if (input.validity.valueMissing) {
      throw Error('unrequired unchecked radio button should not be invalid');
    }
    input.required = true;
    if (! input.validity.valueMissing || ! input.previousSibling.validity.valueMissing) {
      throw Error('required unchecked radio button should be invalid');
    }
    input.checked = true;
    if (input.validity.valueMissing || input.previousSibling.validity.valueMissing) {
      throw Error('required checked radio button should not be invalid');
    }
    input.checked = false;
    form.reportValidity();
    var warnings = form.getElementsByClassName('hf-warning');
    if (warnings.length !== 1) {
      throw Error('there should exactly one error message be shown, not '+warnings.length);
    }
    if (input.previousSibling !== warnings[0]) {
      throw Error('the warning should be attached to the first radio button');
    }
    form.getElementsByTagName('button')[0].click();
    if (warnings.length !== 1) {
      throw Error('there should exactly one error message be shown on submit, not '+warnings.length);
    }
    if (input.previousSibling !== warnings[0]) {
      throw Error('the warning on submit should be attached to the first radio button');
    }
    destroy_hform(hform);
  });

  it('should ignore other forms’ radios', function() {
    var hform = make_hform();
    var form = hform.form;
    var input = form.getElementsByTagName('input')[0];
    input.type = 'radio';
    input.checked = false;
    input.required = true;
    var other = input.cloneNode();
    other.checked = true;
    document.body.appendChild(other);
    if (! input.validity.valueMissing) {
      throw Error('required unchecked radio button should be invalid, ignoring other radios outside form');
    }
    destroy_hform(hform);
    document.body.removeChild(other);
  });

});


describe('setCustomValidity', function() {

  it('should update classes', function() {
    var hform = make_hform();
    var form = hform.form;
    var input = form.getElementsByTagName('input')[0];
    input.setCustomValidity('abcdef');
    if (input.className.search('hf-invalid') === -1) {
      throw Error('no hf-invalid class found');
    }
    input.setCustomValidity('');
    if (input.className.search('hf-invalid') !== -1) {
      throw Error('hf-invalid class found');
    }
    input.required = true;
    input.value = '';
    input.setCustomValidity('abcdef');
    if (input.className.search('hf-invalid') === -1) {
      throw Error('no hf-invalid class found although required');
    }
    input.setCustomValidity('');
    if (input.className.search('hf-invalid') === -1) {
      throw Error('no hf-invalid class found although required');
    }
    input.value = 'xyz';
    input.setCustomValidity('abcdef');
    if (input.className.search('hf-invalid') === -1) {
      throw Error('no hf-invalid class found although required');
    }
    input.setCustomValidity('');
    if (input.className.search('hf-invalid') !== -1) {
      throw Error('hf-invalid class found although required and filled');
    }
    destroy_hform(hform);
  });

  it('should update visible messages', function() {
    var hform = make_hform();
    var form = hform.form;
    var input = form.getElementsByTagName('input')[0];
    input.setCustomValidity('abcdef');
    input.reportValidity();
    var warning = document.getElementById(input.getAttribute('aria-errormessage'));
    if (! warning || warning.textContent !== 'abcdef') {
      throw Error('no created warning found');
    }
    input.setCustomValidity('');
    if (warning.textContent !== '') {
      throw Error('warning not cleared');
    }
    input.setCustomValidity('hijklm');
    if (warning.textContent !== 'hijklm') {
      throw Error('warning not updated');
    }
    destroy_hform(hform);
  });

});


describe('addValidator', function() {

  it('should not produce infinite loops when calling setCustomValidity', function() {
    var hform = make_hform();
    var form = hform.form;
    var input = form.getElementsByTagName('input')[0];
    hyperform.addValidator(input, function(element) {
      if (element.value !== 'foo') {
        element.setCustomValidity('oops');
        return false;
      }
      element.setCustomValidity('');
      return true;
    });
    input.reportValidity();
    destroy_hform(hform);
  });

  it('should show error messages when calling setCustomValidity', function() {
    var hform = make_hform();
    var form = hform.form;
    var input = form.getElementsByTagName('input')[0];
    hyperform.addValidator(input, function(element) {
      if (element.value !== 'foo') {
        element.setCustomValidity('oops');
        return false;
      }
      element.setCustomValidity('');
      return true;
    });
    input.reportValidity();
    var warning = document.getElementById(input.getAttribute('aria-errormessage'));
    if (! warning || warning.textContent !== 'oops') {
      throw Error('no custom error message shown');
    }
    input.value = 'foo';
    input.reportValidity();
    if (input.hasAttribute('aria-errormessage') || warning.parentNode) {
      throw Error('custom error message shown');
    }
    destroy_hform(hform);
  });

});
