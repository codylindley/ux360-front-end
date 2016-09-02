define(function (require) {

	'use strict';

	var Backbone = require('backbone');
	var buildURL = require('utilities/buildApiUrl');
	var session = require('utilities/session');
	var mediator = require('utilities/mediator');

	return Backbone.Model.extend({

		idAttribute: 'peso_id',

		initialize: function(attributes, options){

			this.prjt_id = options.prjt_id;

			this.on('sync', function(){
				mediator.trigger('updateProjectPersonas');
			});

		},

		addRelationship: function(){
			this.url = buildURL({
				serviceClassName: 'prjt_projectService',
				serviceMethodName: 'addProjectrelationship',
				serviceParameters: {
					pjre_prjt_id: this.prjt_id,
					type: 'Persona',
					pjre_referencepk: this.id,
					groupId: session.groupId,
					userId: session.userId
				}
			});
			return this.fetch();
		},

		deleteRelationship: function(){
			this.url = buildURL({
				serviceClassName: 'prjt_projectService',
				serviceMethodName: 'deleteProjectrelationship',
				serviceParameters: {
					pjre_prjt_id: this.prjt_id,
					type: 'Persona',
					pjre_referencepk: this.id,
					groupId: session.groupId,
					userId: session.userId
				}
			});
			return this.fetch();
		}

	});

});
