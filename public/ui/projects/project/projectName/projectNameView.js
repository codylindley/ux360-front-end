define(function (require) {

	'use strict';


	// ******************************
	// Region Dependencies
	// ******************************

	// Backbone (View)
	var BaseView = require('backboneBaseObjects/baseView');

	// Template
	var projectNameTemplate = require('html!./projectNameTemplate');

	// Project Model
	var ProjectModel = require('models/projectModel');
	var projectModel;


	return BaseView.extend({

		initialize: function(options){
			projectModel = new ProjectModel({prjt_id: options.prjt_id});
			projectModel.once('sync', this.render, this);
			projectModel.fetch();
		},

		render: function(){
			this.$el.html(projectNameTemplate(projectModel.toJSON()));
		}

	});

});
