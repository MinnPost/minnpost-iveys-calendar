/* global module:false */

/**
 * Grunt file that handles managing tasks such as rendering
 * SASS, providing a basic HTTP server, building a
 * distribution, and deploying.
 */
module.exports = function(grunt) {
  var _ = grunt.util._;


  // Project configuration.  Many values are directly read from
  // package.json.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") + "\\n" %>' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= pkg.license || _.pluck(pkg.licenses, "type").join(", ") %> */' +
        '<%= "\\n\\n" %>'
    },

    // Clean up the distribution fold
    clean: {
      folder: 'dist/'
    },

    // JS Hint checks code for coding styles and possible errors
    jshint: {
      options: {
        curly: true,
        forin: true,
        latedef: true,
        indent: 2,
        // For document.write in deployment.js
        evil: true
      },
      files: ['Gruntfile.js', 'js/**/*.js', 'tests/**/*.js', 'data-processing/**/*.js']
    },


    // Compass is an extended SASS.  Set it up so that it generates to .tmp/
    compass: {
      options: {
        sassDir: 'styles',
        fontsDir: 'styles/fonts',
        imagesDir: 'images',
        javascriptsDir: 'js',
        importPath: 'bower_components',
        httpPath: './',
        relativeAssets: true
      },
      dist: {
        options: {
          environment: 'production',
          outputStyle: 'expanded',
          cssDir: 'styles',
          generatedImagesDir: 'dist/images'
        }
      }
    },

    // Copy relevant files over to distribution
    copy: {
      images: {
        files: [
          {
            cwd: './images/',
            expand: true,
            src: ['**'],
            dest: 'dist/images/'
          }
        ]
      },
      css: {
        files: [
          { src: 'styles/main.css', dest: 'dist/<%= pkg.name %>.css' }
        ]
      }
    },

    // R.js to bring together files through requirejs.
    requirejs: {
      app: {
        options: {
          name: 'app',
          baseUrl: 'js',
          mainConfigFile: 'js/config.js',
          out: 'dist/<%= pkg.name %>.js',
          optimize: 'none',
          include: ['almond'],
          wrap: {
            startFile: 'js/build/wrapper.start.js',
            endFile: 'js/build/wrapper.end.js'
          }
        }
      }
    },

    // Minify JS for network efficiency
    uglify: {
      js: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: ['<%= requirejs.app.options.out %>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    // Minify CSS for network efficiency
    cssmin: {
      options: {
        banner: '<%= meta.banner %>',
        report: true
      },
      css: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: ['dist/<%= pkg.name %>.css'],
        dest: 'dist/<%= pkg.name %>.min.css'
      }
    },

    // Deploy to S3
    s3: {
      options: {
        // This is specific to MinnPost
        //
        // These are assumed to be environment variables:
        //
        // AWS_ACCESS_KEY_ID
        // AWS_SECRET_ACCESS_KEY
        //
        // See https://npmjs.org/package/grunt-s3
        //key: 'YOUR KEY',
        //secret: 'YOUR SECRET',
        bucket: 'data.minnpost',
        access: 'public-read',
        gzip: true
      },
      mp_deploy: {
        upload: [
          {
            src: 'dist/*',
            dest: 'projects/<%= pkg.name %>/'
          },
          {
            src: 'dist/data/**/*',
            dest: 'projects/<%= pkg.name %>/data/',
            rel: 'dist/data'
          },
          {
            src: 'dist/images/**/*',
            dest: 'projects/<%= pkg.name %>/images/',
            rel: 'dist/images'
          }
        ]
      }
    },

    // Browser sync and server
    browserSync: {
      bsFiles: {
        src: ['<%= jshint.files %>', 'js/templates/**/*', 'styles/**/*.css', '.tmp/**/*.css', 'dist/**/*.css', 'dist/**/*.js']
      },
      options: {
        server: {
          baseDir: './'
        },
        watchTask: true,
        port: 8857
      }
    },

    // Watches files for changes and performs task
    watch: {
      files: ['<%= jshint.files %>', 'styles/*.scss'],
      tasks: 'watcher'
    }
  });

  // Load plugin tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-s3');

  // Custom task to output embed code when deploy is run, if the project is Inline
  grunt.registerTask('inline_embed', 'Embed code generation.', function(name) {
    grunt.log.writeln('To embed this in an article, use the following.  For full page article, copy relevant code from index-deploy.html.');
    grunt.log.writeln('=====================================');
    grunt.log.writeln('<div id="' + name + '-container mp"></div>');
    grunt.log.writeln('<script type="text/javascript" src="https://s3.amazonaws.com/data.minnpost/projects/' + name + '/' + name + '.embed.latest.min.js"></script>');
    grunt.log.writeln('=====================================');
  });

  // Default build task
  grunt.registerTask('default', ['jshint', 'compass', 'clean', 'copy', 'requirejs', 'cssmin', 'uglify']);

  // Watch tasks
  grunt.registerTask('watcher', ['default']);
  grunt.registerTask('server', ['default', 'browserSync', 'watch']);

  // Deploy tasks
  grunt.registerTask('deploy', ['s3']);

};
