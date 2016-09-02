define(function (require) {

	'use strict';

	var handlebars = require('handlebars');
	var $ = require('jquery');

	handlebars['default'].registerHelper('decodeHTML', function(str){

		return $('<textarea />').html(str).val();
	});

});


