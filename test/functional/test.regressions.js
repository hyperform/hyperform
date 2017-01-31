var form, hform;


beforeEach(function() {
  form = document.createElement('form');
  form.innerHTML = '<input name="test" value="button_span">'+
                   '<button><span>submit</span></button>';
  hform = hyperform(form);
  document.body.appendChild(form);
});


afterEach(function() {
  if (form) {
    if (form.parentNode) {
      form.parentNode.removeChild(form);
    }
    hform.destroy();
    form = undefined;
    hform = undefined;
  }
});


describe('Issue 13', function() {

  it('should add name=value of submit button', function(done) {
    form.method = 'get';
    form.addEventListener('submit', function(evt) {
      if (! evt.submittedVia || evt.submittedVia.nodeName !== 'BUTTON') {
        throw Error('not a Hyperform submit event');
      }
    });

    const button = form.querySelector('button');
    button.name = 'test';
    button.value = 'value';

    const iframe = document.createElement('iframe');
    iframe.src = './blank.html';
    document.body.appendChild(iframe);
    form.parentNode.removeChild(form);
    iframe.contentDocument.body.appendChild(form);
    form.action = 'blank.html';

    function run() {
      iframe.removeEventListener('load', run);

      if (iframe.contentWindow.location.search.search(/test=value/) === -1) {
        throw Error('test value not found');
      }
      iframe.parentNode.removeChild(iframe);
      done();
    }

    iframe.addEventListener('load', run);
    button.click();
  });

});


describe('Issue 34', function() {

  it('should catch submit when clicking on span nested in button', function(done) {
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
