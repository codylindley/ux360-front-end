define(function (require) {

	'use strict';

	var handlebars = require('handlebars');

	handlebars['default'].registerHelper('decodeUrl', function(url){
		return decodeURIComponent(url).replace(/\+/g,' ');
	});

});


