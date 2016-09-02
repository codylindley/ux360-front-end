define(function (require) {

	'use strict';

	var Backbone = require('backbone');
	var buildURL = require('utilities/buildApiUrl');
	var session = require('utilities/session');
	var mediator = require('utilities/mediator');

	var ProjectPersonaModel = require('models/projectPersonaModel');

	return Backbone.Collection.extend({

		model: ProjectPersonaModel,

		initialize: function(models, options){
			this.prjt_id = options.prjt_id;
			mediator.on('updateProjectPersona', this.updateProjectPersona, this);
		},

		updateProjectPersona: function(peso_id, checked){

			var projectPersonaModel = new ProjectPersonaModel(
				{ peso_id: peso_id }, // attributes
				{ prjt_id: this.prjt_id } // options
			);

			var addOrDeleteRelationship = checked ? 'deleteRelationship' : 'addRelationship';
			projectPersonaModel[addOrDeleteRelationship]();

		},

		url: function(){
			return buildURL({
				serviceClassName: 'prjt_projectService',
				serviceMethodName: 'findAllItemsByProject_Type',
				serviceParameters: {
					prjt_id: this.prjt_id,
					type: 'Persona',
					groupId: session.groupId,
					userId: session.userId
				}
			});
		}

	});

});
