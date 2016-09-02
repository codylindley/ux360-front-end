define(function (require) {

	'use strict';

	var Backbone = require('backbone');

	var PersonaModel = require('models/personaModel');

	return Backbone.Collection.extend({

		model: PersonaModel

	});

});
