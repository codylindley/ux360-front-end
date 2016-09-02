define(function (require) {

	'use strict';

	var handlebars = require('handlebars');
	var _ = require('underscore');

	handlebars['default'].registerHelper('attsCheckboxs', function(value, string){

		var check = false;

		_(value.split('|')).forEach(function(item,i){

			if(new RegExp('^'+item+'$').test(string)){
				check = 'checked';
				return false;
			}

		});

		return check;

	});

});


