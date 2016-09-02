define(function (require) {
	'use strict';

	var $ = require('jquery');
	var mediator = require('utilities/mediator');
	var NProgress = require('nprogress');

	// Start the progress bar animation.
	NProgress.start();

	// Set later, in `ajaxStop`.
	var progressBypass;

	$.ajaxSetup({
		cache: false,
		beforeSend: function(xhr, settings) {
			progressBypass = settings.progressBypass ? true : false;
		}
	});

	// Ajax: Run if successful.
	$(document).ajaxSuccess(function(e, xhr, settings) {
		// Add code here.
	});

	// Ajax: Run if error.
	$(document).ajaxError(function(e, xhr, settings) {
		// Add code here.
	});

	// Ajax: Run after, regardless of success/error.
	$(document).ajaxComplete(function(e, xhr, settings) {
		// Add code here.
	});

	// Ajax: Run when it begins.
	$(document).ajaxStart(function() {
		// Add code here.
	});

	// Ajax: Run when it stops.
	$(document).ajaxStop(function() {
		if (progressBypass) {
			progressBypass = false;
		}
		else {
			NProgress.done();
		}
	});

	return;
});