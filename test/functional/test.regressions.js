function regressions_make_hform(_doc, settings) {
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


function once(element, event, handler) {
  var func = function(evt) {
    element.removeEventListener(event, func);
    handler(evt);
  };
  element.addEventListener(event, func);
}


describe('Issue 7', function() {

  it('should publish validation methods on HTMLFormElements', function() {
    var hform = regressions_make_hform();
    var form = hform.form;
    if (! ('reportValidity' in form)) {
      throw Error('no reportValidity method found');
    }
    destroy_hform(hform);
  });

});


describe('Issue 11', function() {

  it('should fire a cancelable submit event', function(done) {
    // revalidate:never was part of the original issue report
    var hform = regressions_make_hform(document, { revalidate: 'never' });
    var form = hform.form;

    form.addEventListener('submit', function(evt) {
      if (! evt.submittedVia || evt.submittedVia.nodeName !== 'BUTTON') {
        throw Error('not a Hyperform submit event');
      }
      evt.preventDefault();
      destroy_hform(hform);
      done();
    });

    form.querySelector('button').click();
  });

});


describe('Issue 13', function() {

  it('should add name=value of submit button', function(done) {
    /* we're taking a deviation here by creating the form in an iframe, so
     * we can submit the form and check that the button's name=value is
     * really there. */
    var iframe = document.createElement('iframe');
    iframe.src = 'blank.html';
    document.body.appendChild(iframe);

    once(iframe.contentWindow, 'load', function() {
      var hform = regressions_make_hform(iframe.contentDocument);
      var form = hform.form;
      form.method = 'get';
      form.addEventListener('submit', function(evt) {
        if (! evt.submittedVia || evt.submittedVia.nodeName !== 'BUTTON') {
          throw Error('not a Hyperform submit event');
        }
      });

      var button = form.querySelector('button');
      button.name = 'test';
      button.value = 'value';

      form.parentNode.removeChild(form);
      iframe.contentDocument.body.appendChild(form);
      form.action = '#';

      setTimeout(function(){
        once(iframe, 'load', function() {
          if (iframe.contentWindow.location.search.search(/test=value/) === -1) {
            throw Error('test value not found');
          }
          iframe.parentNode.removeChild(iframe);
          done();
        });

        button.click();
      }, 100);
    });
  });

});


describe('Issue 34', function() {

  it('should catch submit when clicking on span nested in button', function(done) {
    var hform = regressions_make_hform();
    var form = hform.form;
    form.addEventListener('submit', function(evt) {
      evt.preventDefault();
      if (! evt.submittedVia || evt.submittedVia.nodeName !== 'BUTTON') {
        throw Error('not a Hyperform submit event');
      }
      destroy_hform(hform);
      done();
    });
    form.querySelector('button span').click();
  });

});


describe('Issue 35', function() {

  it('should work in IE <= 10 when called on non-window', function() {
    // see https://github.com/hyperform/hyperform/issues/35#issuecomment-264213879
    hyperform(document).destroy();
  });

});


describe('Issue 41', function() {

  /* IE has no document.currentScript, and apparently it can't be polyfilled
   * in IE 11 anyway. */
  if (navigator.userAgent.search('Trident') === -1) {
    it('should autoload when requested', function(done) {
      var iframe = document.createElement('iframe');
      iframe.src = 'blank.html';

      document.body.appendChild(iframe);

      once(iframe.contentWindow, 'load', function() {
        var el = iframe.contentDocument.createElement('script');
        el.src = '../../dist/hyperform.js';
        el.setAttribute('data-hf-autoload', '');
        el.addEventListener('load', function() {
          if (! iframe.contentWindow.HTMLInputElement.prototype.checkValidity.__hyperform) {
            throw Error('no original checkValidity method detected');
          }
          iframe.parentNode.removeChild(iframe);
          done();
        });
        iframe.contentDocument.body.appendChild(el);
      });
    });
  }

  it('should not autoload when not requested', function(done) {
    var iframe = document.createElement('iframe');
    iframe.src = 'blank.html';
    document.body.appendChild(iframe);

    once(iframe.contentWindow, 'load', function() {
      var el = iframe.contentDocument.createElement('script');
      el.src = '../../dist/hyperform.js';
      iframe.contentDocument.body.appendChild(el);
      el.addEventListener('load', function() {
        if ('_original_checkValidity' in iframe.contentWindow.HTMLFormElement) {
          throw Error('overwritten checkValidity method detected');
        }
        iframe.parentNode.removeChild(iframe);
        done();
      });
    });
  });

});


describe('Issue 45', function() {

  it('should use the minlength value in the "tooShort" warning string', function() {
    var hform = regressions_make_hform();
    var form = hform.form;
    var input = form.getElementsByTagName('input')[0];
    input.setAttribute('minlength', '3');
    input.setAttribute('maxlength', '5');
    input.value = 'ab';
    input.checkValidity();

    if (input.validationMessage.search('5') > -1) {
      throw Error('validation message uses maxlength value: '+
                  input.validationMessage);
    }

    if (input.validationMessage.search('3') === -1 &&
        input.validationMessage.search('2') === -1) {
      throw Error('validation message does not reference values: '+
                  input.validationMessage);
    }

    destroy_hform(hform);
  });

});


describe('Issue 49', function() {

  it('should detect an invalid date when called on non-window', function() {
    var form = document.createElement('form');
    var input = document.createElement('input');
    input.name = 'test';
    input.type = 'date';
    form.appendChild(input);
    document.body.appendChild(form);
    var hform = hyperform(form);

    values = ['abc', '01.01.2000', '2000-01', '2000-13-32'];
    for (var i = 0; i < values.length; i++) {
      input.value = values[i];
      if (input.value && ! input.validity.badInput) {
        throw Error(values[i]+' should not be a valid date');
      }
    }

    hform.destroy();
    document.body.removeChild(form);
  });

  /* TODO we should not only test setting input.value but actually entering
   * values. However, that's behind the input's shadow DOM where we cannot
   * access fields. The test above is trivially true, but we need to make
   * sure, that manually entered wrong values result in a badInput. */

});


describe('Issue 69', function() {

  it('should check, if a required <select> option is not in fact disabled', function() {
    var form = document.createElement('form');
    var select = document.createElement('select');
    select.innerHTML = '<option>another</option><option selected disabled>select another</option>';
    select.required = true;
    form.appendChild(select);
    document.body.appendChild(form);
    var hform = hyperform(form);

    if (! select.validity.valueMissing) {
      throw Error('select has no submittable option selected');
    }

    hform.destroy();
    document.body.removeChild(form);
  });

});


describe('Issue 78', function() {

  it('should not run validation when tabbing into an element', function() {
    var hform = regressions_make_hform(document, { revalidate: 'oninput' });
    var validated = false;
    hyperform.addValidator(hform.form.elements[0], function() {
      validated = true;
    });
    hform.form.elements[0].focus();
    var e = document.createEvent('HTMLEvents');
    e.keyCode = 9;
    e.initEvent('keyup', true, true);
    hform.form.elements[0].dispatchEvent(e);
    if (validated) {
      throw Error('should not have validated on tab');
    }
    var e = document.createEvent('HTMLEvents');
    e.keyCode = 65;
    e.initEvent('keyup', true, true);
    hform.form.elements[0].dispatchEvent(e);
    if (! validated) {
      throw Error('should have validated on other keyCode');
    }

    hform.destroy();
    document.body.removeChild(hform.form);
  });

});


describe('Issue 85', function() {

  it('should fail validation, when the placeholder option is selected', function() {
    var form = document.createElement('form');
    var select = document.createElement('select');
    select.innerHTML = '<option value="">select another</option><option>another</option><option value="">really empty!</option>';
    select.required = true;
    form.appendChild(select);
    document.body.appendChild(form);
    var hform = hyperform(form);

    if (! select.validity.valueMissing) {
      throw Error('select has no submittable option selected');
    }
    select.options[2].selected = true;
    if (select.validity.valueMissing) {
      throw Error('an empty option that is not the placeholder option should be permissible.');
    }
    select.options[0].selected = true;
    if (! select.validity.valueMissing) {
      throw Error('the placeholder option is not permissible.');
    }

    destroy_hform(hform);
  });

});


describe('Issue 87', function() {

  it('should not validate elements of a form@novalidate', function() {
    var hform = regressions_make_hform();
    var form = hform.form;
    form.setAttribute('novalidate', '');
    var input = form.getElementsByTagName('input')[0];
    input.setAttribute('minlength', '3');
    input.value = 'ab';

    if (input.validity.valid) {
      throw Error('elements inside a form@novalidate should be validated, if explicitly requested');
    }

    input.addEventListener('invalid', function(event) {
      throw Error('elements inside a form@novalidate should not be validated on submit');
    });
    form.addEventListener('submit', function(event) {
      event.preventDefault();
    });
    form.elements[0].click();
    form.elements[0].focus();
    form.elements[0].blur();
    form.elements[1].click();

    destroy_hform(hform);
  });

});
