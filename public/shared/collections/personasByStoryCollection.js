define(function (require) {

	'use strict';

	var _ = require('underscore');
	var Backbone = require('backbone');
	var buildData = require('utilities/buildApiData');
	var session = require('utilities/session');

	var PersonaModel = require('models/personaModel');

	return Backbone.Collection.extend({

		url: '/uxm-plugin/json',

		model: PersonaModel,

		parse: function(response){
			var photo;
			return _.map(response, function(persona){
				persona.photo = persona['Primary Photo'][0] || {
					cropped_path_small: "/T7_PM-theme/images/not_avail_142_142.png",
					path_medium: "/T7_PM-theme/images/not_avail_142_142.png",
					path_small: "/T7_PM-theme/images/not_avail_142_142.png",
					cropped_path_large: "/T7_PM-theme/images/not_avail_142_142.png",
					path_large: "/T7_PM-theme/images/not_avail_142_142.png"
				};
				persona.photo.cropped_path_small = persona.photo.cropped_path_small || '/T7_PM-theme/images/not_avail_142_142.png';
				return persona;
			});
		},

		read: function(stry_id){
			var data = buildData({
				serviceClassName: 'stry_userstoryService',
				serviceMethodName: 'getPersonasByUserstory',
				serviceParameters: {
					stry_id: stry_id,
					groupId: session.groupId,
					userId: session.userId
				}
			});
			return this.fetch({
				data: data
			});
		}

	});

});
