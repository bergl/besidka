module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['js/source/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    concat: {
        css: {
           src: [
                 'css/source/*'
                ],
            dest: 'css/besidka.all.css'
        },
        js : {
            src : [
                'js/source/*'
            ],
            dest : 'js/besidka.all.js'
        }
    },
    cssmin: {
        css: {
            src: 'css/besidka.all.css',
            dest: 'css/besidka.min.css'
        }
    },
    uglify: {
        js: {
            files: {
                'js/besidka.min.js': ['js/besidka.all.js']
            }
        }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
    csslint: {
      strict: {
        options: {
          import: 2
        },
        src: ['css/source/*.css']
      }
    },
    clean: ["css/besidka.all.css", "js/besidka.all.js"]
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('default', ['jshint','concat:css', 'cssmin:css', 'concat:js', 'uglify:js', 'clean']);
};