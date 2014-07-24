/*
 * grunt-lessvarfile
 * https://github.com/nsdcss/grunt-lessvarfile
 *
 * Copyright (c) 2013 Nikolaj Sokolowski
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	var fs = require('fs');
	var p = require('path');

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
			alignAt: 40,
			optionalComponentIdentifier: 'oc__',
			includeAllComponents: true,
			optionalComponentsList: []
		});

		var blacklist = [
			'@media',
			'@import',
			'@charset',
			'@font-face',
			'@-webkit-keyframes',
			'@-moz-keyframes',
			'@-o-keyframes',
			'@keyframes'
		];

		var variables = {};
		var optionalComponentIdentifierMatch = new RegExp('^' + options.optionalComponentIdentifier,"g");

		var checkIfVariable = function(the_line) {
			if(the_line.match(variableDeclaration)) {
				for(var i = 0; i < blacklist.length; i++) {
					var str = blacklist[i];
					var strLength = str.length;
					if(the_line.substring(0,strLength) === str) {
						return false;
					}
				}
				return true;
			}
			return false;
		};

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
				if (checkIfVariable(lines[i])) {
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
			grunt.log.writeln('Fetched existing variables...');
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

		var checkIfNeededComponent = function(filepath) {
			var fileName = p.basename(filepath);
			if(fileName.match(optionalComponentIdentifierMatch)) {
				if(options.optionalComponentsList.indexOf(fileName) >= 0) {
					grunt.log.writeln('Component "' + fileName + '" will be included');
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		};

		this.files.forEach(function (f) {

			getExistingVariables(f.dest);
			var src = f.src.filter(function (filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					if(options.includeAllComponents) {
						return true;
					} else {
						return checkIfNeededComponent(filepath);
					}

				}
			}).map(function (filepath) {
					// Read file source.
					var fileContent = grunt.file.read(filepath);
					grunt.log.writeln('Fetching variables from file:' + filepath);
					getVariables(fileContent);
				});

			// Write the destination file.
			grunt.file.write(f.dest, makeOutputString(variables));

			// Print a success message.
			grunt.log.writeln('Updated "' + f.dest + '"');
		});

	});

};




