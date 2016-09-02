define(function (require) {
	'use strict';

	var _ = require('underscore');
	var Backbone = require('backbone');
	var session = require('utilities/session');
	var mediator = require('utilities/mediator');

	// All views can use these once loaded.
	require('handlebarsHelpers/debug');
	require('bootstrapJS');
	require('bootstrapModalManager');

	// Extension to boostrap modal.
	require('boostrapModalExt');

	// CSS.
	require('css!ui/ux360LayoutStyle');

	// HTML.
	var ux360LayoutTemplate = require('html!ui/ux360LayoutTemplate');

	// Build the view.
	return Backbone.View.extend({
		constructor: function(options){
			var opts = arguments[0] || {};

			// Setup options.
			this.options = opts;

			if (opts.renderBaseLayout){
				// Append header, nav, and content from ux360LayoutTemplate.html
				// to `<div data-view="ux360"></div>` found in index.html
				$('div[data-view="ux360"]').html(ux360LayoutTemplate({
					randomNumber: _.random(0, 10)+'',
					session: session
				}));
			}

			// Once the global ux360 markup is in place, set
			// the `el` to the `el` passed in when instantiated
			// or default to `<div data-view="content"></div>`.
			this.setElement(opts.el || $('div[data-view="content"]'));

			// We have to call this because we are using our own constructor and we
			// have to pass options like Backbone does and call instance initialize.
			this.initialize.apply(this, arguments);

			// Add this view to be cleaned.
			this.addViewsToCleanOnRouting(this);
		},

		viewsToCleanOnRouting: [],

		addViewsToCleanOnRouting: function(){
			/*
				Have this base layout view listen for the router to tell the mediator another
				route, not the first route has been called and cleaning needs to happen.
			*/
			mediator.once('cleanViews', this.cleanViews, this);

			var views = Array.prototype.slice.call(arguments);
			var viewsToCleanOnRouting = this.viewsToCleanOnRouting;
			_.each(views, function(view){
				viewsToCleanOnRouting.push(view);
			});

			// Remove duplicates.
			viewsToCleanOnRouting = _.uniq(viewsToCleanOnRouting);
		},

		cleanViews: function(){
			// Any views in viewsToCleanOnRouting will be cleaned up by calling `remove()`.
			_.each(this.viewsToCleanOnRouting, function(view){
				mediator.off(null, null, view);

				// This removes all events added using events hash.
				view.undelegateEvents();

				// Remove does not do this so we need to, so we can still use `on()`.
				view.off();

				// Clean up `window` and `document` events as well.
				$(window).off('resize.baseView');
				view.remove();
			});

			this.viewsToCleanOnRouting.length = 0;
		}

	// END: return.
	});

// END: define.
});