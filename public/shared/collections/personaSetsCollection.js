define(function (require) {

	'use strict';

	var _ = require('underscore');
	var Backbone = require('backbone');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');
	var mediator = require('utilities/mediator');

	var personaSetsCollection;
	var PersonaSetModel = require('models/personaSetModel');

	return Backbone.Collection.extend({

		model: PersonaSetModel,

		initialize: function(){
			personaSetsCollection = this;
			mediator.on('updateProjectPersona', this.updateProjectPersona, this);
		},

		updateProjectPersona: function(peso_id, checked){
			if(this.get('all')){

				var allPersonas = this.get('all').get('Personas');
				_.find(allPersonas, function(persona){
					return persona.peso_id === peso_id;
				}).checked = checked;

			}
		},

		updateProjectPersonas: function(projectPersonasCollection){
			projectPersonasCollection.each(function(model){
				this.updateProjectPersona(model.get('peso_id'), true);
			}, this);
		},

		parse: function(response){
			if(!response[0]){
				return [];
			}
			var allPersonas = [];
			_.each(response, function(personaSet){
				personaSet.personaCount = personaSet.Personas.length;
				_.each(personaSet.Personas, function(persona){

					persona.photo = persona['Primary Photo'][0] || {
						cropped_path_small: "/T7_PM-theme/images/not_avail_142_142.png",
						path_medium: "/T7_PM-theme/images/not_avail_142_142.png",
						path_small: "/T7_PM-theme/images/not_avail_142_142.png",
						cropped_path_large: "/T7_PM-theme/images/not_avail_142_142.png",
						path_large: "/T7_PM-theme/images/not_avail_142_142.png"
					};
					persona.photo.cropped_path_small = persona.photo.cropped_path_small || '/T7_PM-theme/images/not_avail_142_142.png';

					allPersonas.push(persona);
				});
			});

			response.unshift({
				isActive: true,
				pest_id: 'all',
				pest_name: 'All Personas',
				personaCount: allPersonas.length,
				Personas: allPersonas
			});

			return response;
		},

		url: function(){
			return buildURL({
				serviceClassName: 'pest_personasetService',
				serviceMethodName: 'findAllPersonasetsView',
				serviceParameters: {
					orderByAscending: true,
					showPersonas: true,
					showPersonasCount: true,
					page: 0,
					showPersonasetComments: false,
					showPersonasetCommentsCount: true,
					showPersonasetHistory: false,
					showPersonasetStudies: false,
					showPersonaComments: false,
					showPersonaCommentsCount: true,
					showPersonasets: false,
					showPersonaHistory: false,
					showPersonaVideos: false,
					showPersonaVideosCount: false,
					groupId: session.groupId,
					userId: session.userId
				}
			});
		}

	});

});
