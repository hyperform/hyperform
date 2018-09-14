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
