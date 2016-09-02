define(function (require) {

	'use strict';

	var Backbone = require('backbone');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');

	return Backbone.Model.extend({

		idAttribute: 'prjt_id',

		url: function(){
			return buildURL({
				serviceClassName: 'prjt_projectService',
				serviceMethodName: 'getProject',
				serviceParameters: {
					prjt_id: this.id
				}
			});
		},

		read: function(){
			this.url = buildURL({
				serviceClassName: 'prjt_projectService',
				serviceMethodName: 'getProject',
				serviceParameters: {
					prjt_id: this.id
				}
			});
			return this.fetch();
		},

		update: function(){
			this.url = buildURL({
				serviceClassName: 'prjt_projectService',
				serviceMethodName: 'updateProject',
				serviceParameters: {
					prjt_id: this.id,
					prjt_name: this.get('prjt_name'),
					prjt_description: this.get('prjt_description'),
					workingGroups: this.get('workingGroups') || [],
					groupId: session.groupId,
					userId: session.userId
				}
			});
			return this.fetch();
		},

		'delete': function(){
			this.url = buildURL({
				serviceClassName: 'prjt_projectService',
				serviceMethodName: 'deleteProject',
				serviceParameters: {
					prjt_id: this.id,
					groupId: session.groupId,
					userId: session.userId
				}
			});
			return this.fetch();
		},

		create: function(){
			this.url = buildURL({
				serviceClassName: 'prjt_projectService',
				serviceMethodName: 'addProject',
				serviceParameters: {
					prjt_name: this.get('prjt_name'),
					prjt_description: this.get('prjt_description'),
					workingGroups: this.get('workingGroups') || [],
					groupId: session.groupId,
					userId: session.userId
				}
			});
			return this.fetch();
		}

	});

});
