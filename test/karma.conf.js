module.exports = function(config){
  config.set({
	basePath : '../',
	files : [
	    'app/bower_components/angular/angular.min.js',
		'app/bower_components/angular-mocks/angular-mocks.js',
		'app/bower_components/angular-animate/angular-animate.min.js',
		'app/bower_components/angular-bootstrap/ui-bootstrap.min.js',
		'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
		'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
		'app/bower_components/satellizer/satellizer.min.js',
		'app/app.js',
		'app/bower_components/moment/min/moment-with-locales.min.js',
		'app/bower_components/angular-local-storage/dist/angular-local-storage.min.js',
		'app/bower_components/lodash/dist/lodash.min.js',
		'app/bower_components/angular-simple-logger/dist/angular-simple-logger.min.js',
		'app/bower_components/angular-google-maps/dist/angular-google-maps.min.js',
		'app/bower_components/angular-websocket/dist/angular-websocket.min.js',

		'app/components/**/*.js',
		'app/views/**/*.js',

		'https://maps.googleapis.com/maps/api/js?sensor=false', //<--this one
		'test/mocks/maps.googleapis.com-maps-api.js', //<--and this one, changing path as necessary for the mock file you just added
	],

	autoWatch : true,
	frameworks: ['jasmine'],
	browsers : ['Chrome'],
	plugins : [
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-jasmine',
			'karma-junit-reporter'
			],

	junitReporter : {
	  outputFile: 'test_out/unit.xml',
	  suite: 'unit'
	}
  });
};
