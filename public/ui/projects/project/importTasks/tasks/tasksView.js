define(function (require) {
	'use strict';

	var BaseView = require('backboneBaseObjects/baseView');
	var mediator = require('utilities/mediator');
	var session = require('utilities/session');
	var handlebars = require('handlebars');

	require('css!./tasksStyle');

	var tasksTemplate = require('html!./tasksTemplate');
	var taskTemplate = require('html!./taskTemplate');

	var TasksCollection = require('collections/tasksCollection');
	var tasksCollection;

	// Used later.
	var prjt_id;

	return BaseView.extend({
		initialize: function(options) {

			prjt_id = options.prjt_id;

			tasksCollection = new TasksCollection([], {prjt_id: prjt_id});

			var Handlebars = handlebars['default'];

			Handlebars.registerPartial('taskTemplate', taskTemplate);

			Handlebars.registerHelper('formatUserstory', function(Userstory) {
				if (Userstory && Userstory.stry_name) {
					return Userstory.stry_name;
				}

				if (Userstory && Userstory.imported > 0) {
					return '<i>previously imported</i>';
				}

				return '';
			});

			Handlebars.registerHelper('addOrDeleteUserstory', function(Userstory) {
				if (Userstory && Userstory.stry_name) {
					return 'glyphicon-arrow-left';
				}

				return 'glyphicon-arrow-right';
			});

			Handlebars.registerHelper('isVisible', function(scen_id) {
				var task = tasksCollection.taskDictionary[scen_id];
				return task.isVisible || task.depth === 0 ? '' : 'task-hidden';
			});

			Handlebars.registerHelper('taskToggleClass', function(scen_id) {
				var task = tasksCollection.taskDictionary[scen_id];
				return task.isOpen ? 'glyphicon-chevron-down' : 'glyphicon-chevron-right';
			});

			this.listenTo(tasksCollection, 'sync' , function(tasksCollection, response, options) {
				this.originalCollection = options.xhr.responseText;
				this.render();
			});

			mediator.on('updateProjectPersona', function() {
				setTimeout(function() {
					tasksCollection.read();
				}, 500);
			}, this);

			tasksCollection.read();
		},

		events: {
			'click .glyphicon-arrow-right': 'convertTasks',
			'click .glyphicon-arrow-left': 'revertTasks',
			'click .btn-save': 'save',
			'click .btn-cancel': 'cancel',
			'click .task-toggle': 'toggleTask'
		},

		toggleTask: function(e) {
			var arrow = $(e.currentTarget);
			var scen_id = arrow.closest('.task').data('scen_id');
			var task = tasksCollection.taskDictionary[scen_id];

			task.isOpen = task.isOpen ? false : true;

			var that = this;

			_.each(task.Tasks, function(Task) {
				that.updateSubTaskVisibility(Task.scen_id, task.isOpen);
			});

			this.render();
		},

		updateSubTaskVisibility: function(scen_id, isVisible) {
			var that = this;
			var task = tasksCollection.taskDictionary[scen_id];

			task.isVisible = isVisible;

			// _.each(task.Tasks, function(Task) {
			// 	that.updateSubTaskVisibility(Task.scen_id, isVisible);
			// });
		},

		save: function() {
			tasksCollection.update().done(function() {
				mediator.trigger('navigate', 'projects/' + prjt_id, {trigger: true});
			});
		},

		cancel: function() {
			tasksCollection.reset(JSON.parse(this.originalCollection));
			this.render();
		},

		revertTasks: function(e) {
			var tr = $(e.currentTarget).closest('tr');
			var scen_id = tr.data('scen_id');
			var task = tasksCollection.taskDictionary[scen_id];
			this.removeStory(task);
			this.render();
		},

		removeStory: function(task) {
			task.Userstory = task.Userstory || {};

			delete task.Userstory.action;
			delete task.Userstory.stry_id;
			delete task.Userstory.stry_name;
			delete task.Userstory.stry_description;

			var subTasks = task.Tasks || task.Tasks || [];

			_.each(subTasks, this.removeStory, this);
		},

		convertTasks: function(e) {
			var tr = $(e.currentTarget).closest('tr');
			var td = $(e.currentTarget).closest('td');
			var checkPreviouslyImported = td.next().text();

			if (checkPreviouslyImported !== 'previously imported\n') {
				var scen_id = tr.data('scen_id');
				var task = tasksCollection.taskDictionary[scen_id];
				this.convertTask(task);
				this.render();
			}
		},

		convertTask: function(task) {
			var userstory = task.Userstory || {};
			task.Userstory = _.extend(userstory, {
				action: 0,
				stry_id: 0,
				stry_name: task.scen_name,
				stry_description: task.Description
			});

			var subTasks = task.Tasks || task.Tasks || [];

			_.each(subTasks, this.convertTask, this);
		},

		render: function() {
			this.$el.html(tasksTemplate(tasksCollection.toJSON()));
			this.delegateEvents();
			return this;
		}

	// END: return.
	});

// END: define.
});