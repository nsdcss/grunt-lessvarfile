/*
 * grunt-lessvarfile
 * https://github.com/nsdcss/var-creator
 *
 * Copyright (c) 2013 Nikolaj Sokolowski
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js', 'tasks/*.js', '<%= nodeunit.tests %>', ],
			options: {
				jshintrc: '.jshintrc',
			},
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['tmp'],
		},

		// Configuration to be run (and then tested).
		lessvarfile: {
			default_options: {
				options: {

				},
				files: {
					'tmp/variables--default.less': 'test/fixtures/**/*.less'
				}
			},
			custom_options: {
				options: {
					alignAt: 1,
					sectionsmap: {
						'c': 'My Crazy Colors',
						's': 'My Spacing',
						't': 'My Typo'
					}
				},
				files: {
					'tmp/variables--custom.less': 'test/fixtures/**/*.less'
				}
			}
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js'],
		},

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'lessvarfile', 'nodeunit']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint', 'test']);

};
