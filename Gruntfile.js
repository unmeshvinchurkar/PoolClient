module.exports = function(grunt)
{

	// Project configuration.
	grunt.initConfig({

		pkg : grunt.file.readJSON('package.json'),

		concat : {
			options : {
				// define a string to put between each file in the concatenated
				// output
				separator : ';'
			},
			dist : {
				// the files to concatenate
				src : [ 'src/main/webapp/framework/**/*.js' ],
				// the location of the resulting JS file
				dest : 'dist/<%= pkg.name %>.js'
			}
		},

		minified : {
			files : {
				src : [ 'dist/<%= pkg.name %>.js' ],
				dest : 'dist/<%= pkg.name %>.min.js'
			},
			options : {
				sourcemap : true,
				allinone : false
			}
		},

		uglify : {
			options: {
           mangle: false
             },
			all_src : {
				options : {
					sourceMap : false,
					sourceMapName : 'sourceMap.map'
				},
				src : 'dest/src/**/*.js',
				dest : 'dest/src.all.min.js'
			},

			all_vendors : {
				options : {
					sourceMap : false,
					sourceMapName : 'sourceMap.map'
				},
				src : 'dest/vendorLib/**/*.js',
				dest : 'dest/vendors.all.min.js'
			}
		},

		css_url_relative : {
			styles : {
				options : {
					staticRoot : 'dest'
				},
				files : {
					'dest/vendor.css' : [ 'dest/vendorLib/**/*.css' ],
					'dest/src.css' : [ 'dest/src/**/*.css' ]
				}
			}
		},

		concat_css : {
			options : {
			// Task-specific options go here.
			},
			all_src : {
				src : [ "dest/vendorLib/**/*.css" ],
				dest : "dest/vendor.css"
			}
		},

		copy : {
			main : {
				files : [

				// includes files within path and its sub-directories
				{
					expand : true,
					cwd : 'src/main/webapp/vendorlib',
					src : [ '**' ],
					dest : 'dest/vendorLib/'
				}, {
					expand : true,
					cwd : 'src/main/webapp/framework',
					src : [ '**' ],
					dest : 'dest/src'
				} ],
			},
		},

		clean : {
			after_build : {
				src : [ 'dest/vendorLib/**/*.js', 'dest/src/**/*.js',
						'dest/vendorLib/**/*.css', 'dest/src/**/*.css' ]
			},
			before_build : {
				src : [ 'dest/*','!dest/*.html' ]
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-concat-css');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-minified');
	grunt.loadNpmTasks('grunt-css-url-relative');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Default task(s).
	grunt.registerTask('cleandest', [ 'clean:after_build' ]);
	grunt.registerTask('default', [ 'clean:before_build', 'copy', 'uglify',
			'css_url_relative', 'clean:after_build' ]);

};