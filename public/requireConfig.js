// This is the first JS file included in the application.

// In development mode, a config is set in index.html as well as in this file.

// Base URL is the public folder, so all paths in require.js start in public.

// Starting a path here or in a module with "/", adding ".js" to end, or
// starting with "http(s):" will treat the path as a regular URL that is
// relative to document (i.e. index.html). DON'T DO THIS!

// Using "./" in path to include dependencies in a module will ignore base URL
// and look for that file relative to the module referencing the dependency.

require.config({
	// Remember base URL is "public" folder because index.html is what is loading require.js
	// and by default the path is the directory that contains the HTML page running RequireJS

	// baseUrl: '',

	paths: {
		// AMD JS files.
		almond: 'bower_components/almond/almond',
		backbone: 'bower_components/backbone/backbone',
		handlebars: 'bower_components/handlebars/handlebars.amd',
		text: 'bower_components/requirejs-text/text',

		// Note: We call it underscore but it's really Lo-Dash.
		underscore: 'bower_components/lodash/dist/lodash',

		html: 'bower_components/requirejs-handlebars-plugin/requirejs-handlebars-plugin',
		cookie: 'bower_components/jquery.cookie/jquery.cookie',
		jquery: 'bower_components/jquery/dist/jquery',
		spin: 'bower_components/ladda-bootstrap/dist/spin',
		ladda: 'bower_components/ladda-bootstrap/dist/ladda',
		moment: 'bower_components/momentjs/moment',
		nprogress: 'bower_components/nprogress/nprogress',

		// Depends upon, had to do it to get AMD to work cause A-hole dev's won't send built code to bower
		//amd but bower repo has no built code so must amd in
		imagesloaded: 'bower_components/imagesloaded/imagesloaded',

		// Depends upon:
		eventEmitter: 'bower_components/eventEmitter',
		eventie: 'bower_components/eventie',

		// Not AMD JS files, so you must shim dependencies below.
		bootstrapJS: 'bower_components/bootstrap/dist/js/bootstrap',
		textInputCounter: 'bower_components/jQuery.Maxlength/jquery.maxlength',
		maskInputsAlphaNum: 'bower_components/jquery.alphanum/jquery.alphanum',
		growTextarea: 'bower_components/Autogrow-Textarea/jquery.autogrowtextarea',
		bootstrapToggle: 'bower_components/bootstrap-switch/build/js/bootstrap-switch',
		maskInputs: 'bower_components/jQuery-Mask-Plugin/jquery.mask',
		bootstrapGrowl: 'bower_components/bootstrap-growl/jquery.bootstrap-growl',
		powertip: 'bower_components/jquery-powertip/dist/jquery.powertip',
		jQueryColor: 'bower_components/jquery-color/jquery.color',
		jQueryBlink: 'bower_components/modern-blink/jquery.modern-blink',
		jQueryUpload: 'bower_components/jQuery.AjaxFileUpload.js/jquery.ajaxfileupload',
		jQueryTimer: 'bower_components/jquery-timer/jquery.timer',
		bootstrapModalManager: 'bower_components/bootstrap-modal/js/bootstrap-modalmanager',
		boostrapModalExt: 'bower_components/bootstrap-modal/js/bootstrap-modal',
		vgrid:'bower_components/jQuery-vGrid-Plugin/jquery.vgrid',

		// Shortcuts to shared stuff: Kendo UI, jQuery UI, etc.
		backboneBaseObjects: 'shared/backboneBaseObjects',
		utilities: 'shared/utilities',
		collections: 'shared/collections',
		models: 'shared/models',
		templates: 'shared/templates',
		handlebarsHelpers: 'shared/handlebarsHelpers',
		views: 'shared/views',

		// Look below at `map`. This is very important for CSS plugin.
		'require-css': 'bower_components/require-css',

		jqueryui: 'bower_components/jquery-ui/ui',
		kendoui: 'shared/kendoui/src/js'
	},
	//Mostly have to clarify jquery plugins, that are not AMD, dependencies
	shim: { //i.e. define dependencies of non-amd scripts (fyi root non-amd script could have AMD dependencies)
		jQueryColor: ['jquery'],
		textInputCounter: ['jquery'],
		vgrid: ['jquery','bower_components/jquery-easing/jquery.easing'],
		bootstrapToggle: ['jquery'],
		jQueryTimer: ['jquery'],
		maskInputsAlphaNum: ['jquery'],
		maskInputs: ['jquery'],
		growTextarea: ['jquery'],
		cookie: ['jquery'],
		bootstrapJS: ['jquery'],
		bootstrapGrowl: ['jquery'],
		jQueryBlink: ['jquery'],
		jQueryUpload: ['jquery'],
		bootstrapModalManager: ['jquery','bootstrapJS'],
		boostrapModalExt : ['jquery','bootstrapJS']
	},
	map: { //
		'*': {
			// Add the global `var bypassCss = true` to any context
			// (browser window or Node) to prevent CSS from loading.

			// This is useful for unit testing, without styling.
			css: typeof bypassCss !== 'undefined' ? 'utilities/bypassCss' : 'require-css/css'
		}
	}
});