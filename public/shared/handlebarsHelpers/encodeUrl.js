define(function (require) {

	'use strict';

	var handlebars = require('handlebars');

	handlebars['default'].registerHelper('encodeUrl', function(url){
		return encodeURIComponent(url);
	});

});


