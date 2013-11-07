/*
 * grunt-lessvarfile
 * https://github.com/nsdcss/var-creator
 *
 * Copyright (c) 2013 Nikolaj Sokolowski
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	var fs = require('fs');

	var variableDeclaration = /^\@/;

	grunt.registerMultiTask('lessvarfile', 'Create less variable files', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			sectionDelimiter: '--',
			sectionsmap: {
				'c': 'Colors',
				's': 'Spacing',
				't': 'Typo'
			},
			alignAt: 40
		});
		var variables = {};

		var makeHeading = function (string) {
			var stringArray = string.split('-');
			var str = "";
			for (var i = 0; i < stringArray.length; i++) {
				var s = stringArray[i];
				str += s.charAt(0).toUpperCase() + s.slice(1) + ' ';
			}
			return str.trim();
		};

		var getVariables = function (css) {
			var lines = css.split('\n');
			for (var i = 0; i < lines.length; i++) {
				if (lines[i].match(variableDeclaration) && lines[i].substring(0,6) !== '@media') {
					var split = lines[i].split(':');
					var variableKey = split[0].trim();
					var variableValue = split[1].trim();
					var variableGroup = variableKey.split(options.sectionDelimiter)[0].slice(1);
					variables[variableGroup] = variables[variableGroup] || {};
					if (typeof variables[variableGroup][variableKey] === "undefined") {
						variables[variableGroup][variableKey] = variableValue;
					}
				}
			}
		};

		var getExistingVariables = function (existing) {
			if (grunt.file.exists(existing)) {
				getVariables(grunt.file.read(existing));
				grunt.log.writeln('"' + existing + '" already exists. Existing variables are parsed...');
			} else {
				grunt.log.writeln('"' + existing + '" does not exist it will be created');
			}
			console.log('Fetched existing variables...');
		};

		var makeOutputString = function (variablesObj) {
			var output = "// VARIABLES\n";
			output += "// ==========\n";
			for (var variableGroup in variablesObj) {
				if (variablesObj.hasOwnProperty(variableGroup)) {
					var variableGroupName = options.sectionsmap[variableGroup] || makeHeading(variableGroup);
					var variables = variablesObj[variableGroup];
					output += "\n\n// " + variableGroupName + "\n";
					output += "// ----------\n";
					for (var variable in variables) {
						if (variables.hasOwnProperty(variable)) {
							var variableKey = variable;
							var variableValue = variables[variable];
							var extraSpaces = (options.alignAt - variableKey.length) > 0 ? (options.alignAt - variableKey.length) : 1;
							output += variableKey + ":";
							output += new Array(extraSpaces + 1).join(" ");
							output += variableValue + "\n";
						}
					}
				}
			}
			return output;
		};

		this.files.forEach(function (f) {

			getExistingVariables(f.dest);
			var src = f.src.filter(function (filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function (filepath) {
					// Read file source.
					var file = grunt.file.read(filepath);
					console.log('Fetching variables from file:' + filepath);
					getVariables(file);
				});

			// Write the destination file.
			grunt.file.write(f.dest, makeOutputString(variables));

			// Print a success message.
			grunt.log.writeln('Updated "' + f.dest + '"');
		});

	});

};




