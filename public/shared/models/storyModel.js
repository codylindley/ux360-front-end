define(function (require) {

	'use strict';

	var Backbone = require('backbone');
	var buildURL = require('utilities/buildApiUrl');
	var session = require('utilities/session');
	var mediator = require('utilities/mediator');

	return Backbone.Model.extend({

		idAttribute: 'stry_id',

		initialize: function(){

			mediator.trigger('cardwall:registerCard', this);

			this.on('change', function(){
				mediator.trigger('card:change');
			});

		},

		url: function(){
			return buildURL({
				serviceClassName: 'stry_userstoryService',
				serviceMethodName: 'getUserstory',
				serviceParameters: {
					stry_prjt_id: this.get('stry_prjt_id'),
					groupId: session.groupId,
					userId: session.userId
				}
			});
		},

		read: function(){
			this.url = buildURL({
				serviceClassName: 'stry_userstoryService',
				serviceMethodName: 'getUserstory',
				serviceParameters: {
					stry_prjt_id: this.get('stry_prjt_id'),
					groupId: session.groupId,
					userId: session.userId
				}
			});
			return this.fetch();
		},

		create: function(){
			this.url = buildURL({
				serviceClassName: 'stry_userstoryService',
				serviceMethodName: 'addUserstory',
				serviceParameters: {
					stry_prjt_id: this.get('stry_prjt_id'),
					stry_scenarioitem: 0,
					stry_parent: 0,
					stry_name: this.get('stry_name'),
					stry_description: this.get('stry_description'),
					stry_level: 0,
					groupId: session.groupId,
					userId: session.userId
				}
			});
			return this.fetch({ type: 'POST' });
		},

		'delete': function(){
			this.url = buildURL({
				serviceClassName: 'stry_userstoryService',
				serviceMethodName: 'deleteUserstory',
				serviceParameters: {
					stry_id: this.id,
					groupId: session.groupId,
					userId: session.userId
				}
			});
			return this.fetch();
		}

	});

});
