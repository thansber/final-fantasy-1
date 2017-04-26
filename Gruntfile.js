module.exports = function(grunt) {

  grunt.initConfig({
    'concat-json': {
      maps: {
        base: 'src/ff-maps/map-data',
        src: 'src/ff-maps/map-data/**/*.json',
        dest: 'src/ff-maps/map-data.json',
        //transforms: ['towns'],
        options: {
          space: '  '
        }
      }
    },
    watch: {
      files: ['']
    }
  });

  grunt.loadNpmTasks('grunt-concat-json');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default');
  grunt.registerTask('maps', ['concat-json:maps']);

};
