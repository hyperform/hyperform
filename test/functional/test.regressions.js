function make_hform(_doc) {
  _doc = _doc || document;
  const form = document.createElement('form');
  form.innerHTML = '<input name="test" value="button_span">'+
                   '<button><span>submit</span></button>';
  const hform = _doc.defaultView.hyperform(form);
  _doc.body.appendChild(form);
  return hform;
}


function once(element, event, handler) {
  var func = function(evt) {
    handler(evt);
    element.removeEventListener(event, func);
  };
  element.addEventListener(event, func);
}


describe('Issue 13', function() {

  it('should add name=value of submit button', function(done) {
    const iframe = document.createElement('iframe');
    iframe.src = './blank.html';
    document.body.appendChild(iframe);

    once(iframe, 'load', function() {
      const form = make_hform(iframe.contentDocument).form;
      form.method = 'get';
      form.addEventListener('submit', function(evt) {
        if (! evt.submittedVia || evt.submittedVia.nodeName !== 'BUTTON') {
          throw Error('not a Hyperform submit event');
        }
      });

      const button = form.querySelector('button');
      button.name = 'test';
      button.value = 'value';

      form.parentNode.removeChild(form);
      iframe.contentDocument.body.appendChild(form);
      form.action = 'blank.html';

      once(iframe, 'load', function() {
        if (iframe.contentWindow.location.search.search(/test=value/) === -1) {
          throw Error('test value not found');
        }
        iframe.parentNode.removeChild(iframe);
        done();
      });

      button.click();
    });
  });

});


describe('Issue 34', function() {

  it('should catch submit when clicking on span nested in button', function(done) {
    const form = make_hform().form;
    form.addEventListener('submit', function(evt) {
      evt.preventDefault();
      if (! evt.submittedVia || evt.submittedVia.nodeName !== 'BUTTON') {
        throw Error('not a Hyperform submit event');
      }
      done();
    });
    form.querySelector('button span').click();
  });

});
