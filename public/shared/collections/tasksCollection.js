define(function (require) {

	'use strict';

	var Backbone = require('backbone');
	var buildURL = require('utilities/buildApiUrl');
	var buildData = require('utilities/buildApiData');
	var session = require('utilities/session');
	var TaskModel = require('models/taskModel');

	return Backbone.Collection.extend({

		url: '/uxm-plugin/json',

		model: TaskModel,

		taskDictionary: {},

		initialize: function(models, options){
			window.taskDictionary = this.taskDictionary;
			this.prjt_id = options.prjt_id;
		},

		parse: function(response, depth){
			if(typeof depth === 'object'){
				depth = 0;
			}else{
				depth++;
			}
			var that = this;
			_.each(response, function(task){
				task.depth = depth;
				var preExistingTask = that.taskDictionary[task.scen_id] || {};
				that.taskDictionary[task.scen_id] = _.extend(task, preExistingTask);
				that.parse(task.Tasks, depth);
			});
			return response;
		},

		read: function(){
			var data = buildData({
				serviceClassName: 'prjt_projectService',
				serviceMethodName: 'getCompleteProjectTasks',
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

		update: function(){
			var data = buildData({
				serviceClassName: 'prjt_projectService',
				serviceMethodName: 'addorUpdateCompleteProjectTasks',
				serviceParameters: {
					prjtMap: JSON.stringify(this),
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
