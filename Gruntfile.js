module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    folders: {
      webapp: {
        root: 'src/main/webapp/',
        build: 'src/main/webapp/WEB-INF/'
      }
    },

    bower_concat: {
      all: {
        dest: '<%= folders.webapp.build %>js/lib.js',
        cssDest: '<%= folders.webapp.build %>style/main.css',
        bowerOptions: {
          relative: false
        }
      }
    },

    concat: {
      js: {
        src: [ '<%= folders.webapp.root %>/app/app.js', '<%= folders.webapp.root %>/app/**/*.js' ],
        dest: '<%= folders.webapp.build %>js/app.js'
      },
      css:{
        src: [ '<%= folders.webapp.root %>/style/**/*.css' ],
        dest: '<%= folders.webapp.build %>style/main.css'
      }
    },

    copy: {
      tomcat: {
        src: ['<%= folders.webapp.root %>/web.xml'],
        dest: '<%= folders.webapp.build %>/web.xml'
      },
      resources: {
        expand: true,
        cwd: '<%= folders.webapp.root %>/../resources/',
        src: ['**/**/*'],
        dest: '<%= folders.webapp.build %>/resources/'
      },
      img: {
        expand: true,
        cwd: '<%= folders.webapp.root %>/images/',
        src: ['**/**/*'],
        dest: '<%= folders.webapp.build %>images/'
      },
      templates: {
        expand: true,
        cwd: '<%= folders.webapp.root %>',
        src: ['index.html', 'pages/**/*.html'],
        dest: '<%= folders.webapp.build %>'
      },
      fonts: {
        expand: true,
        flatten: true,
        src: [ 'bower_components/components-font-awesome/fonts/**/*'],
        dest: '<%= folders.webapp.build %>/fonts/'
      }      
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      js: {
        src: '<%= concat.js.dest %>',
        dest: '<%= folders.webapp.build %>js/app.min.js'
      }
    },

    jshint: {
      options: {
        curly:    false,
        eqeqeq:   true,
        immed:    true,
        latedef:  false,
        newcap:   true,
        noarg:    true,
        sub:      true,
        undef:    false,
        unused:   true,
        boss:     true,
        eqnull:   true,
        browser:  true,
        globals: {
          jQuery: true
        }
      },
      all: ['Gruntfile.js', '<%= folders.webapp.root %>/app/**/*.js']
    },

    qunit: {
      files: ['test/**/*.html']
    },

    watch: {
      js: {
        files: '<%= jshint.all %>',
        tasks: ['concat:js'],
        options: {
          reload: true,
          livereload: {
              host: 'localhost',
              port: 1337
          }
        }
      },
      templates: {
        files: ['<%= folders.webapp.root %>/index.html', '<%= folders.webapp.root %>pages/**/*.html'],
        tasks: [ 'copy:pages' ],
        options: {
          reload: true,
          livereload: {
              host: 'localhost',
              port: 1337
          }
        }
      },
      css: {
        files: '<%= folders.webapp.root %>/style/*.css',
        tasks: [ 'concat:css' ],
        options: {
          reload: true,
          livereload: {
              host: 'localhost',
              port: 1337
          }
        }
      }

    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-bower-concat');

  grunt.registerTask('default', ['bower_concat', 'copy', 'concat', 'uglify', 'watch']);
  grunt.registerTask('dev', ['jshint', 'concat']);

};
