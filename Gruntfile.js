// Generated on 2015-01-31 using generator-angular 0.10.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Required for running test server
  var serveStatic = require('serve-static');

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Project settings
    yeoman: appConfig,

    uglify: {
      options: {
        mangle: {
          except: [
            'bower_components/angular/*.js',
            'bower_components/angular-animate/*.js',
            'bower_components/angular-bootstrap/*.js',
            'bower_components/angular-loader/*.js',
            'bower_components/angular-mocks/*.js',
            'bower_components/angular-ui-router/**/*.js',
            'bower_components/satellizer/*.js',
            'bower_components/lodash/*.js',
            'bower_components/angular-simple-logger/*.js',
            'bower_components/angular-google-maps/*.js',
            'bower_components/angular-websocket/dist/*.js',
            '/components/add-users/add-users-modal-directive.js',
            'bower_components/angular-websocket/dist/*.js.map']
        }
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/app.js': ['<%= yeoman.dist %>/app.js'],
          '<%= yeoman.dist %>/views/about/about.js': ['<%= yeoman.dist %>/views/about/about.js'],
          '<%= yeoman.dist %>/views/contact/contact.js': ['<%= yeoman.dist %>/views/contact/contact.js'],
          '<%= yeoman.dist %>/views/home/home.js': ['<%= yeoman.dist %>/views/home/home.js'],
          '<%= yeoman.dist %>/views/persona/persona.js': ['<%= yeoman.dist %>/views/persona/persona.js'],
          '<%= yeoman.dist %>/views/login/login.js': ['<%= yeoman.dist %>/views/login/login.js'],
          '<%= yeoman.dist %>/views/user/user.js': ['<%= yeoman.dist %>/views/user/user.js'],
          '<%= yeoman.dist %>/components/auth-service/auth-service.js': ['<%= yeoman.dist %>/components/auth-service/auth-service.js'],
          '<%= yeoman.dist %>/components/common-service/common-service.js': ['<%= yeoman.dist %>/components/common-service/common-service.js'],
          '<%= yeoman.dist %>/components/user-service/user-service.js': ['<%= yeoman.dist %>/components/user-service/user-service.js'],
          '<%= yeoman.dist %>/components/realm-service/realm-service.js': ['<%= yeoman.dist %>/components/realm-service/realm-service.js'],
          '<%= yeoman.dist %>/components/realm-service/realm-websocket.js': ['<%= yeoman.dist %>/components/realm-service/realm-websocket.js'],
          '<%= yeoman.dist %>/components/persona-service/persona-service.js': ['<%= yeoman.dist %>/components/persona-service/persona-service.js'],
          '<%= yeoman.dist %>/components/shift-service/shift-service.js': ['<%= yeoman.dist %>/components/shift-service/shift-service.js'],
          '<%= yeoman.dist %>/components/ng-autocomplete/ngAutocomplete.js': ['<%= yeoman.dist %>/components/ng-autocomplete/ngAutocomplete.js'],
          '<%= yeoman.dist %>/components/create-realm-directive/create-realm-directive.js': ['<%= yeoman.dist %>/components/create-realm-directive/create-realm-directive.js'],
          '<%= yeoman.dist %>/components/add-shift-directive/add-shift-directive.js': ['<%= yeoman.dist %>/components/add-shift-directive/add-shift-directive.js'],
          '<%= yeoman.dist %>/components/add-users/add-users-directive.js': ['<%= yeoman.dist %>/components/add-users/add-users-directive.js'],
          '<%= yeoman.dist %>/components/user-shift-list-directive/user-shift-list-directive.js': ['<%= yeoman.dist %>/components/user-shift-list-directive/user-shift-list-directive.js'],
          '<%= yeoman.dist %>/components/realm-available-shift-list-directive/realm-available-shift-list-directive.js': ['<%= yeoman.dist %>/components/realm-available-shift-list-directive/realm-available-shift-list-directive.js'],
          '<%= yeoman.dist %>/components/directives/shift-block/shift-block.js': ['<%= yeoman.dist %>/components/directives/shift-block/shift-block.js']
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },

      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              serveStatic('.tmp'),
              connect().use(
                '/bower_components',
                  serveStatic('./bower_components')
              ),
              serveStatic(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              serveStatic('.tmp'),
              serveStatic('test'),
              connect().use(
                '/bower_components',
                  serveStatic('./bower_components')
              ),
              serveStatic(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({browsers: ['last 1 version']})
        ]
      },
      dist: {
        src: 'app/css/*.css'
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          //'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/images']
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'app/css',
          src: ['*.css', '!*.min.css'],
          dest: '<%= yeoman.dist %>/css',
          ext: '.min.css'
        }]
      }
    },
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */',
      },
      dist: {
        src: ['app/app.js'], //, 'app/**/*.js'
        dest: 'dist/app.js',
      },
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js', 'test/spec/{,*/}*.js', '!oldieshim.js'],
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      options: {
        noProcess: '**/*test.js'
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          //flatten: true,
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'views/{,*/}*.js',
            '!views/{,*/}*test.js',
            'components/{,*/}*.js',
            'components/directives/{,*/}*.js',
            'components/directives/{,*/}*.html',
            'components/*/dist/*min.js',
            '!components/jsTimezoneDetect/dist/jstz.js',
            'components/{,*/}*.html',
            'uib/template/{,*/}*.html',
            '!components/{,*/}*test.js',
            'images/{,*/}*.{webp}',
            'images/{,*/}*.png',
            'fonts/{,*/}*.*',
            'bower_components/angular/angular.min.js',
            'bower_components/angular-bootstrap/ui-bootstrap.min.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'bower_components/bootstrap/dist/fonts/*',
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'bower_components/satellizer/satellizer.min.js',
            'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
            'bower_components/moment/min/moment-with-locales.min.js',
            'bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
            'bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.templates.js',
            'bower_components/angular-bootstrap-datetimepicker/src/css/datetimepicker.css',
            'bower_components/lodash/dist/lodash.min.js',
            'bower_components/angular-google-maps/dist/angular-google-maps.min.js',
            'bower_components/angular-simple-logger/dist/angular-simple-logger.min.js',
            'bower_components/angular-websocket/dist/angular-websocket.min.js',
            'bower_components/angular-websocket/dist/angular-websocket.min.js.map'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        //flatten: true,
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
      ],
      test: [
      ],
      dist: [
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      },
      continuous: {
        configFile: 'test/karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS'],
        reporters: ['dots', 'junit'],
        junitReporter: {
          outputFile: 'test-results.xml'
        }
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'postcss',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'postcss',
    'connect:test',
    'karma:unit'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'concat',
    'ngAnnotate',
    'copy:dist',
    // 'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('cibuild', [
    'clean:server',
    'concurrent:test',
    'postcss',
    'connect:test',
    'karma:continuous',
    'build'
  ])
};
