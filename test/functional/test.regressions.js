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
    form.parentNode.removeChild(form);
    hform.destroy();
    form = undefined;
    hform = undefined;
  }
});

describe('Issue 34', function() {

  it('should submit when clicking on span nested in button', function(done) {
    form.addEventListener('submit', function(evt) {
      evt.preventDefault();
      if (! evt.submittedVia || evt.submittedVia.nodeName !== 'button') {
        throw Error('not a Hyperform submit event');
      }
      done();
    });
    form.querySelector('button span').click();
  });

});
