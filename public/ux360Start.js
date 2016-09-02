define(function (require) {
	'use strict';

	//ux360BaseCSS loads globals like bootstrap and our boostrapOverrides
	require('shared/styles/ux360BaseCSS');

	//setup default jQuery settings for AJAX methods
	require('utilities/ajaxSetup');

	//js
	var Backbone = require('backbone'); //require in so we can start router
	var Router = require('router');
	var session = require('utilities/session');
	var mediator = require('utilities/mediator');

	// Is this localhost?
	var localhost =
		location.port === '8081' &&
		!location.hostname.match(/personamodeler\.com|ux360\.com/gi);

	// Used by Backbone.history to know where the root of the application is
	// being served from.
	// In liferay the it's something like group/beta1/ux360#foo
	// In Node it's localhost:8081/#foo
	session.root = localhost ? '' : session.root || '';

	// create ux360 namespace (useful for debugging)
	window.ux360 = {
		session: session,

		// Router is in global namespace.
		router: new Router(),

		// Needed so that modules can talk to each other.
		mediator: mediator,

		// Is this localhost?
		localhost: (function() {
			var l = window.location;
			var r = /personamodeler\.com|ux360\.com/gi;

			// Not test or prod domains.
			var host = !l.hostname.match(r);

			// The correct port?
			var port = l.port === '8081';

			// Report result.
			return host && port;
		})()
	};

	// load session info from liferay server
	session.load().done(function(){
		/*
			The root path needed by the router.
			In Node, you're already in the root.

			In Liferay, get the root path from the "session.root"

			- Example: /group/beta1
		*/

		// Route the initial URL by calling:
		Backbone.history.start({root: session.root});
	});

	return;

// END: define.
});