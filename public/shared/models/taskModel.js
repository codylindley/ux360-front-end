define(function (require) {

	'use strict';

	var Backbone = require('backbone');
	var session = require('utilities/session');

	return Backbone.Model.extend({
		idAttribute: 'scen_id'
	});

});
