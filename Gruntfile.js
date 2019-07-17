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

    watch: {
      scripts: {
        files: [
          'client/dist/bundle.js'
        ],
        tasks: [
          'concat',
          'uglify'
        ],
      },
      css: {
        files: 'client/src/App.css',
        tasks: 'cssmin',
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('server-dev', (target) => {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  grunt.registerTask('build', [
    'concat', 'uglify', 'eslint', 'cssmin',
  ]);

  grunt.registerTask('upload', (target) => {
    grunt.task.run([ 'server-dev' ]);
  });

  grunt.registerTask('deploy', [
    'build', 'upload',
  ]);

};
