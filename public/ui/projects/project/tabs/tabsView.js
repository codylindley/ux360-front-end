define(function (require) {

	'use strict';


	// ******************************
	// Region Dependencies
	// ******************************

	// Bootstrap JS & CSS for tabs
	

	// Backbone (View)
	var BaseView = require('backboneBaseObjects/baseView');

	// Template
	var tabsTemplate = require('html!./tabsTemplate');

	var mediator = require('utilities/mediator');

	// Helper
	require('handlebarsHelpers/isActiveTab');


	// ******************************
	// Variables in scope
	// ******************************

	// if the project is a newly created, render the
	// screen with the "Import Task" tab selected
	var isNew;
	var hasChanges;
	var confirmMessage = 'You have unsaved changes. Discard changes and continue?';

	return BaseView.extend({

		initialize: function(options){

			mediator.on('hasChanges', function(_hasChanges){
				hasChanges = _hasChanges;
			});

			this.prjt_id = options.prjt_id;
			this.tab = options.tab;

		},

		events: {
			'click a': 'switchTab'
		},

		switchTab: function(e){
			if(hasChanges){
				if(confirm(confirmMessage)){
					hasChanges = false;
					window.onbeforeunload = '';
				}else{
					e.preventDefault();
				}
			}
		},

		render: function(){
			this.$el.html(tabsTemplate({
				prjt_id: this.prjt_id,
				tab: this.tab
			}));
		}

	});

});
