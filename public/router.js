define(function(require) {
	'use strict';

	var _ = require('underscore');
	var Backbone = require('backbone');
	var session = require('utilities/session');
	var mediator = require('utilities/mediator');
	var NProgress = require('nprogress');

	// Setup references for use when scope is lost because of functions.
	var router;

	// When this is required it returns Router constructor.
	return Backbone.Router.extend({

		// Called when the router is instantiated.
		initialize: function() {

			// Store reference to router object one scope up on var router.
			router = this;

			// Any route that is run, after initial load, will attempt to clean up views.
			// Look at the BaseView.js file to see what the cleanViews event triggers.
			this.on('route',function(route) {
				NProgress.start();
				session.setNavigation(route);
			});

			// Navigate event on mediator that permits other modules
			// to use the `navigate()` method on router instances.
			mediator.on('navigate', router.navigate);
		},

		routes: {
			// This is handled via a function, which determines if the localhost
			// is running in a Node.js environment. If so, defaults to "/group".
			'': 'nohash',

			'admin/api(/:className)(/:methodName)': 'api',
			'admin/mode/:mode': 'mode',
			'projects': 'projects',
			'projects/:prjt_id(/:tab)': 'project',

			// This is dealing with sub routing, where this route is called once, with variable inputs.
			'objects(/:type)(/:objectName)(/:objectId)': 'objects',

			'research':'research',

			// IMPORTANT: Must be last, or will kill things above it.
			'*pageNotFound': 'pageNotFound'
		},

		// Typically, in the app, all routes require the user to be logged in/authenticated.

		/*
			Currently when using the base layout view (i.e baseView.js) it will
			by default load the header and footer (i.e. ux360LayoutStyle.css & ux360LayoutTemplate.html)
			of the application as well as the global styles (i.e. boostrap).
		*/

		// Route callbacks below, for routes above.

		mode: function(mode) {
			var storage = window.localStorage ? window.localStorage : {};

			if (mode === 'src') {
				storage.isSrc = true;
			}
			else {
				delete storage.isSrc;
			}

			window.location.href = '/';
		},

		api: function(className, methodName) {
			require(['ui/admin/api/apiLayoutView'], function(ApiLayoutView) {
				new ApiLayoutView({
					className: className,
					methodName: methodName,
					el: 'div[data-view="ux360"]'
				}).render();
			});
		},

		nohash: function() {
			mediator.trigger('cleanViews');

			// Used later.
			var str = [
				'This is a backbone.js app.',
				'\n\n',
				'Provide a valid route, such as:',
				'\n\n',
				'http://localhost:8081#objects',
				'\n\n',
				'Look in router.js for hash routes.'
			].join('');

			// If localhost.
			if (window.ux360.localhost){
				// Throw an alert.
				alert(str);
			}
			// Otherwise.
			else {
				// Push to dashboard.
				window.location.href = '/group';
			}
		},

		pageNotFound: function() {
			// Remove view state.
			mediator.trigger('cleanViews');

			var url = window.location;

			// Is this localhost?
			var local =
				url.hostname === 'localhost' &&
				url.port === '8081';

			window.location.href = local ? '/group' : '/';
		},

		project: function(prjt_id, tab) {
			mediator.trigger('cleanViews');

			require(['ui/projects/project/projectLayoutView'], function(ProjectDetailsLayoutView) {
				new ProjectDetailsLayoutView({
					renderBaseLayout: true,
					prjt_id: prjt_id,
					tab: tab || 'cardwall'
				}).render();
			});
		},

		projects: function() {
			mediator.trigger('cleanViews');

			// Require the projects list layout view, and create a Backbone view instance.
			require(['ui/projects/projectList/projectListLayoutView'], function(ProjectListLayoutView) {
				new ProjectListLayoutView({
					renderBaseLayout: true
				}).render();
			});
		},

		objects: function(type, objectName, objectId) {
			mediator.trigger('cleanViews');

			require(['ui/objects/objectsLayoutView'],function(ObjectsLayoutView) {
				new ObjectsLayoutView({
					renderBaseLayout: true,
					type:type,
					objectName:objectName,
					objectId:objectId
				}).render();
			});
		},

		research: function() {
			mediator.trigger('cleanViews');

			require(['ui/research/researchLayoutView'],function(researchLayoutView) {
				new researchLayoutView({
					renderBaseLayout: true
				}).render();
			});
		}

	// END: return.
	});

// END: define.
});