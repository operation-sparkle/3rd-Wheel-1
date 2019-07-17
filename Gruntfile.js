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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');

  grunt.registerTask();
};
