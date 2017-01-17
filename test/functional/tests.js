const assert = require('assert');
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const BROWSER = process.env.BROWSER || 'firefox';

describe('Using Hyperform in the browser', function() {
  beforeEach(function() {
    if (process.env.SAUCE_USERNAME) {
      this.browser = new webdriver.Builder()
      .usingServer('http://'+ process.env.SAUCE_USERNAME+':'+process.env.SAUCE_ACCESS_KEY+'@ondemand.saucelabs.com:80/wd/hub')
      .withCapabilities({
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        build: process.env.TRAVIS_BUILD_NUMBER,
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        browserName: BROWSER,
      }).build();
    } else {
      this.browser = new webdriver.Builder()
      .withCapabilities({
        browserName: BROWSER,
      }).build();
    }

    return this.browser.get("http://localhost:8000/index.html");
  });

  afterEach(function() {
    return this.browser.quit();
  });

  it('should submit a valid form', function(done) {
    this.browser.findElement(By.css('#valid button')).click();
    this.browser.getCurrentUrl().then(function(url) {
      assert.equal(url.replace(/.*\?/, ''), 'test=valid');
      done();
    });
  });

  it('should not submit an invalid form', function(done) {
    this.browser.findElement(By.css('#invalid button')).click();
    this.browser.getCurrentUrl().then(function(url) {
      assert.equal(url.indexOf('?'), -1);
      done();
    });
  });

  it('should work if the submit button has children', function(done) {
    const self = this;

    this.browser.executeScript(`document.addEventListener('submit', function(evt) {
      window.hasSubmittedVia = !!evt.submitted_via;
    });`).then(function() {
      self.browser.findElement(By.css('#button_span button span')).click();
      self.browser.executeScript(`return window.hasSubmittedVia;`).then(function(hasIt) {
        assert.ok(hasIt);
        done();
      });
    });
  });
});
