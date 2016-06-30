module.exports = function(grunt) {
	
	grunt.initConfig({
		less: {
			development: {
				options: {
					paths: ['assets/less']
				},
				files: {
					'assets/css/style.css' : 'assets/less/source.less'
				}
			}
		},
		concat: {
			options: {
				seperator: ";",
				stripBanners: true
			},
			dist: {
				src: ['assets/css/reset.css', 'assets/css/style.css'],
				dest: 'assets/css/concat.css'
			}
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'assets/css',
					src: ['concat.css'],
					dest: 'assets/css',
					ext: '.min.css'
				}]
			}
		},
		watch: {
			less: {
				files: ['assets/less/*.less'],
				tasks: ['less', 'concat', 'cssmin']
			}/*,
			cssmin: {
				files: ['assets/css/*.css'],
				tasks: ['concat', 'cssmin']

			}*/
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['less', 'concat', 'cssmin', 'watch']);
};