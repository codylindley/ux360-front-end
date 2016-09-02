define(function (require) {

	'use strict';

	//inherits from:
	var BaseView = require('backboneBaseObjects/baseView');

	//project list layout template
	var projectsListLayoutTemplate = require('html!./projectListLayoutTemplate');

	//////*view's (i.e. regions) in project list layout*///////

	//list region/view
	var ProjectListView = require('./listOfProjects/projectListView');
	var projectListView;

	//create project button region/view
	var CreateProjectButtonView = require('./createProjectButton/createProjectButtonView');
	var createProjectButtonView;

	//create project modal region/view
	var CreateProjectModalView = require('./createProjectModal/createProjectModalView');
	var createProjectModalView;

	//////* end view's in project list layout*///////

	return BaseView.extend({

		render:function(){

			//append layout to <div data-view="content"></div>
			this.$el.html(projectsListLayoutTemplate({}));

			// instantiate sub regions...

			// List View
			projectListView = new ProjectListView({
				el: this.$('.projectListView')
			});

			// Create Project Button
			createProjectButtonView = new CreateProjectButtonView({
				el: this.$('.createProjectButtonView')
			});

			// Create Project Modal
			createProjectModalView = new CreateProjectModalView({el: $('<div class="modal fade" />').appendTo('body')});

			projectListView.render();
			createProjectButtonView.render();

		}

	});

});


