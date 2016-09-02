define(function (require) {

	'use strict';

	var BaseView = require('backboneBaseObjects/baseView');

	require('css!./projectListStyle');
	require('handlebarsHelpers/formatDate');

	var listTemplate = require('html!./projectListTemplate');

	var ProjectsCollection = require('collections/projectsCollection');
	var projectsCollection;

	return BaseView.extend({

		initialize: function(){

			projectsCollection = new ProjectsCollection();
			this.listenTo(projectsCollection, 'sync', this.render);

			projectsCollection.fetch();

		},

		events: {
			'click .delete-project': 'deleteProject'
		},

		deleteProject: function(e){
			e.preventDefault();
			var that = this;
			if(confirm('Are you sure?')){
				var prjt_id = $(e.currentTarget).closest('tr').data('prjt_id');
				var projectModel = projectsCollection.get(prjt_id);
				projectModel['delete']().done(function(){
					projectsCollection.remove(projectModel);
					that.render();
				});
			}
		},

		render: function(){
			this.$el.html(listTemplate(projectsCollection.toJSON()));
		}

	});

});


