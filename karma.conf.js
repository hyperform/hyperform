var customLaunchers = {
  sl_ios_safari: {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.9',
    version: '7.1',
  },
  sl_mac_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'mac=S 10.12',
    version: '10.0',
  },
  sl_ie_10: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '10',
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11',
  },
  sl_edge_14: {
    base: 'SauceLabs',
    browserName: 'microsoft edge',
    platform: 'Windows 10',
    version: '14',
  },
};

['53', '54', '55', 'beta', 'dev'].forEach(version => {
  customLaunchers['sl_chrome_'+version+'_win'] = {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 10',
      version: version,
  };
  customLaunchers['sl_chrome_'+version+'_lin'] = {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Linux',
      version: version,
  };
});

[/*ESR*/'45', '49', '50', '51', 'beta', 'dev'].forEach(version => {
  customLaunchers['sl_firefox_'+version+'_win'] = {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'Windows 10',
      version: version,
  };
  customLaunchers['sl_firefox_'+version+'_lin'] = {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'Linux',
      version: version,
  };
});

module.exports = function(config) {

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'dist/hyperform.js',
      'test/functional/test.*.js',
      { pattern: 'test/functional/blank.html', watched: false, included: true, served: true, nocache: true, }
    ],

    proxies: {
      '/blank.html': '/base/test/functional/blank.html',
      '/dist/hyperform.js': '/base/dist/hyperform.js',
    },

    preprocessors: [],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    //reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    sauceLabs: {
      testName: 'Hyperform functional tests'
    },
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: ['dots', 'saucelabs'],
  })
}
