define(function (require) {
	'use strict';

	var handlebars = require('handlebars');

	function timeStamp(ts) {
		// Create an array with the current month, day, and time.
		var date = [
			ts.getMonth() + 1,
			ts.getDate(),
			ts.getFullYear()
		];

		// Create an array with the current hour, minute, and second.
		var time = [
			ts.getHours(),
			ts.getMinutes(),
			ts.getSeconds()
		];

		// Determine AM or PM suffix, based on the hour.
		var suffix = time[0] < 12 ? 'AM' : 'PM';

		// Convert hour from military time.
		time[0] = time[0] < 12 ? time[0] : time[0] - 12;

		// If hour is 0, set it to 12
		time[0] = time[0] || 12;

		// If seconds and minutes are less than 10, add a zero.
		for ( var i = 1; i < 3; i++ ) {
			if ( time[i] < 10 ) {
				time[i] = '0' + time[i];
			}
		}

		// Return the formatted string.
		return [
			date.join('/'),
			time.join(':'),
			suffix
		].join(' ');
	}

	handlebars['default'].registerHelper('formatDate', function(value) {
		value = parseFloat(value);
		var date = new Date(value);

		return timeStamp(date);
	});
});