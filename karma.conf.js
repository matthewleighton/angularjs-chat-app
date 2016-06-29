// Karma configuration
// Generated on Wed Jun 22 2016 17:19:19 GMT+0100 (GMT Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        //'https://cdn.socket.io/socket.io-1.4.5.js',
        'http://localhost:9876/socket.io/socket.io.js',
        //'socket.io/socket.io.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js',


        

        'bower_components/angular-socket-io/socket.js',
        'bower_components/angular-route/angular-route.js',
        
        'app/app.module.js',

        'app/core/core.module.js',
        'app/core/chatSocket.service.js',


        

        


        'app/login/login.module.js',
        'app/login/login.controller.js',
        'app/login/login.service.js',
        'app/login/login.component.js',

        'app/messaging/messaging.module.js',



        //'bower_components/angular-animate/angular-animate.js',
        //'bower_components/angular-resource/angular-resource.js',
        //'bower_components/angular-route/angular-route.js',
        //'bower_components/angular-mocks/angular-mocks.js',
        //'app/**/*.module.js',
        
        //'app/*!(.module|.spec).js',
        //'!(bower_components)/**/*!(.module|.spec).js',
        'app/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        //'app/**/*.spec.js': ['browserify']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
