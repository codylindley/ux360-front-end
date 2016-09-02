define(function (require) {
	'use strict';

	//=====================
	// Region Dependencies.
	//=====================

	// Backbone (View).
	var BaseView = require('backboneBaseObjects/baseView');

	// Template.
	var detailsTemplate = require('html!./detailsTemplate');

	// For communication between modules.
	var mediator = require('utilities/mediator');

	// Build the view.
	return BaseView.extend({
		initialize: function(){
			this.model = this.options.model;

			// Listen for the flip card event to
			// render details for this card.
			mediator.on('card:flip', function(flipInfo){
				if(flipInfo.stry_id !== (this.model.id || this.model.cid)){ return; }
				this.render();
			}, this);

		},

		events: {
			'click .btn-delete': 'deleteStory',
			'change input, textarea': 'editStory',
			'submit .form-userstory': 'doneEditing'
		},

		doneEditing: function(e){
			e.preventDefault();
		},

		deleteStory: function(e){
			this.model.set('action', -1);
			this.$el.modal('hide');
		},

		editStory: function(e){
			var input = e.currentTarget;
			this.model.set(input.name, input.value);
			this.model.set('action', this.model.id ? 1 : 0, { silent: true });
		},

		render: function() {
			this.$el.html(detailsTemplate(this.model.toJSON()));
		}

	// END: return.
	});

// END: define.
});