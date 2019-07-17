module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: 'client/dist/bundle.js',
        dest: 'dist/built.js',
      },
    },

    uglify: {
      my_target: {
        files: {
          'dist/built.js': ['dist/built.js'],
        }
      }
    },

    eslint: {
      options: {
        quiet: true,
      },
      target: {
        ['dist/built.js'],
      },
    },

    cssmin: {
      'dist/output.css': ['client/src/App.css'],
    },

    nodemon: {
      dev: {
        script: 'server/index.js',
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', (target) => {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  grunt.registerTask('build', [
    'concat', 'uglify', 'eslint', 'cssmin',
  ]);

};
