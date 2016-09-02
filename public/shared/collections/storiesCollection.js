define(function (require) {

	'use strict';

	var collection;
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var session = require('utilities/session');
	var buildData = require('utilities/buildApiData');
	var mediator = require('utilities/mediator');

	var StoryModel = require('models/storyModel');

	return Backbone.Collection.extend({

		url: '/uxm-plugin/json',

		model: StoryModel,

		initialize: function(stories, options){
			var prjt_id = this.prjt_id = options.prjt_id;
		},

		read: function(){
			var data = buildData({
				serviceClassName: 'prjt_projectService',
				serviceMethodName: 'getCompleteProjectUserstories',
				serviceParameters: {
					prjt_id: this.prjt_id,
					groupId: session.groupId,
					userId: session.userId
				}
			});
			return this.fetch({
				data: data
			});
		},

		update: function(stryMap){
			var data = buildData({
				serviceClassName: 'prjt_projectService',
				serviceMethodName: 'addorUpdateCompleteProjectUserstories',
				serviceParameters: {
					stryMap: JSON.stringify(stryMap),
					prjt_id: this.prjt_id,
					groupId: session.groupId,
					userId: session.userId
				}
			});
			return this.fetch({
				type: 'POST',
				data: data
			});
		}

	});

});
