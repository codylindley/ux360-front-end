define(function (require) {

	'use strict';

	

	var BaseView = require('backboneBaseObjects/baseView');
	var mediator = require('utilities/mediator');

	var createProjectModalTemplate = require('html!./createProjectModalTemplate');
	var ProjectModel = require('models/projectModel');
	var projectModel;

	return BaseView.extend({

		initialize: function(){
			projectModel = new ProjectModel();
			this.listenTo(projectModel, 'sync', this.projectCreated);
			mediator.on('showCreateProject', this.render, this);
		},

		events: {
			'submit .add-project-form': 'createProject'
		},

		createProject: function(e){

			e.preventDefault();

			var prjt_name = $.trim(this.$('[name=prjt_name]').val());
			var prjt_description = $.trim(this.$('[name=prjt_description]').val());

			if(!prjt_name){
				alert('please enter a name');
				return;
			}

			projectModel.set({
				prjt_name: prjt_name,
				prjt_description: prjt_description
			});

			this.$el.modal('hide');
			projectModel.create();

		},

		projectCreated: function(){
			mediator.trigger('navigate', 'projects/' + projectModel.id + '/importTasks', {trigger: true});
		},

		render: function() {
			this.$el.html(createProjectModalTemplate({}));
			this.$el.modal({width:'600px',focusOn:'#prjt_name'});
		}

	});

});
