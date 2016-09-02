/*global module:false*/
module.exports = function(grunt) {
	'use strict';

  //avoid having to write grunt.loadNpmTasks for each task in config
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({

		//use this to make the commented jshintrc file valid json before its used by jshint
		//the actual file that is used by jshint is jshintrc, but we set options in jshintrcComments
		jsonmin: {
			dev: {
				options: {
					stripWhitespace: true,
					stripComments: true
				},
				files: {
					".jshintrc" : ".jshintrcComments"
				}
			}
		},

		jshint: {
			options: {
				reporter: 'node_modules/jshint-stylish/stylish.js',
				jshintrc: '.jshintrc'
				//force: true //lets not fail the build yet, remove when you want build to fail on jshint error
			},
			all: [
				'public/**/*.js', // target all js in public
				'!public/shared/kendoui/**', // except minified files
				'!public/**/*.min.js', // except minified files
				'!public/codeComplexityReport/**/*.js', // except minified files
				'!public/bower_components/**' // and bower components
			]
		},

		requirejs: {
			compile: {
				options: { //all options at: https://github.com/jrburke/r.js/blob/master/build/example.build.js
					separateCSS: true,
					out: 'public/ux360.min.js',
					mainConfigFile: 'public/requireConfig.js',
					name: 'almond',
					findNestedDependencies: true,
					optimize: 'uglify2',
					uglify2: {
						compress: {
							sequences: true,
							dead_code: true,
							conditionals: true,
							booleans: true,
							unused: true,
							if_return: true,
							join_vars: true,
							drop_console: true, //IF YOU WANT TO LOG IN BUILD MODE REMOVE THIS
							global_defs: {
								DEBUG: false
							}
						},
						mangle: true
					},
					//exclude these modules from build
					stubModules: ['text', 'html', 'require-css/css', 'handlebarsHelpers/debug'],
					include: ['almondConfig','ux360Start'],
					exclude: ['require-css/normalize'],
					insertRequire: ['ux360Start']
				}
			}
		},

		replace: {
			consoleLogAndLog: {
				src: ['public/ux360.min.js'],
				overwrite: true,
				replacements: [
					{
						from: /[.|,|;|]?log\([A-Za-z0-9,"_';\(\)]*\)[;|,]?/g,
						to: function(match){
							if(match.charAt(0) === '.'){
								return false;
							}else{
								return '0;';
							}
						}
					},
					{
						from: /console.log\([A-Za-z0-9,"_';\(\)]*\)[;|,]?/g,
						to: '0;'
					}
				]
			}
		},

		mocha: {
			all: ['public/testRunner.html']
		},

		watch: {
			/*
				Run this task with the `grunt watch` command to
				lint/hint HTML, CSS, and JS files on save.
			*/
			scripts: {
				files: [
					'!public/bower_components',
					'!public/**/*.min.js',
					'public/**/*.js',
					'GruntFile.js'
				],
				tasks: ['jshint','test']
			},
			html: {
				files: [
					'public/ui/**/*.html',
					'public/index.html',
					'public/shared/**/*.html'
				],
				tasks: ['lintHTML']
			},
			css: {
				files: ['public/ui/**/*.css','public/shared/**/*.css'],
				tasks: ['lintHTML']
			}

		},

		htmlhint: {
			options: {
				htmlhintrc: '.htmlhintrc'
			},
			html: {
				src: [
					'public/ui/**/*.html',
					'public/index.html',
					'public/shared/**/*.html'
				]
			}
		},

		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			src: [
				'public/ui/**/*.css',
				'public/shared/**/*.css',
				'!public/shared/kendoui/**'
			]
		},

		usebanner: {
			testingGuidelines: {
				options: {
					position: 'top',
					banner: grunt.file.read('testingGuidelines.txt')
				},
				files: {
					src: ['public/**/*Test.js']
				}
			}
		},

		plato: {
			run:{
				options : {
					jshint : false
				},
				files: {
					'public/codeComplexityReport': [
						'public/ui/**/*.js',
						'public/requireConfig.js',
						'public/router.js',
						'public/shared/**/*.js',
						'!public/shared/kendoui/**'
					],
				}
			}
		},

		// Clean stuff up
		clean: {
			// Clean any pre-commit hooks in .git/hooks directory
			hooks: ['.git/hooks/pre-commit']
		},

		// Run shell commands
		shell: {
			hooks: {
			// Copy the project's pre-commit hook into .git/hooks
				command:'cp git-hooks/pre-commit .git/hooks/'
			}
		}

	// END: grunt.initConfig
	});


	//register tasks
	//this happens when local developer run npm install for the first time, because grunt is ran from package.json
	grunt.registerTask('addGitPreCommitHook', ['clean:hooks', 'shell:hooks']);

	/*///////// codeComplexityReport /////////*/
	grunt.registerTask('codeComplexityReport', ['plato']);

	/*///////// lintjs /////////*/
	grunt.registerTask('lintJS', ['jsonmin','jshint']);

	/*///////// lintHTML /////////*/
	grunt.registerTask('lintHTML', ['htmlhint']);

	/*///////// lintCSS /////////*/
	grunt.registerTask('lintCSS', ['csslint']);

	//this is what we run before each git commit using a git commit hook, if linting or unit tests fail you can't commit code
	grunt.registerTask('default', [
		'jsonmin',
		'jshint',
		'htmlhint',
		'csslint',
		'requirejs'
		//'checkJsError' //phantomJS breaks sad panda!
	]);

	//this is what we run before each git commit using a git commit hook, if linting or unit tests fail you can't commit code
	grunt.registerTask('precommit', [
		'jsonmin',
		'jshint',
		'htmlhint',
		'csslint',
		'requirejs'
		//'checkJsError' //phantomJS breaks sad panda!
	]);

	/*///////// this task runs by calling grunt with no task name its the default /////////*/
	grunt.registerTask('preproduction', [
		'requirejs', //optimize AMD modules by createing one file
		'cssmin' //odd, but we use css clean to minify ux360.min.css
	]);

// END: module.exports
};