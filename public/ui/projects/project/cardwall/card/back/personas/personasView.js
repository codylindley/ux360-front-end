define(function (require) {

	'use strict';

	// ******************************
	// Region Dependencies
	// ******************************

	// Backbone (View)
	var BaseView = require('backboneBaseObjects/baseView');

	// style
	require('css!./personasStyle');

	// template
	var personasTemplate = require('html!./personasTemplate');

	var PersonasByStoryCollection = require('collections/personasByStoryCollection');

	var mediator = require('utilities/mediator');

	// Bootstrap Dropdown


	return BaseView.extend({
		initialize: function(options){
			this.collection = new PersonasByStoryCollection();
			this.listenTo(this.collection, 'sync', this.render);

			// listen for the flip card event to get the latest
			// comments from the server
			mediator.on('card:flip', function(flipInfo){
				if(flipInfo.stry_id !== options.stry_id){ return; }
				this.collection.read(options.stry_id);
			}, this);

		},
		events: {
			'mouseenter [data-toggle=tooltip]': 'showToolTip'
		},
		showToolTip: function(e){
			$(e.currentTarget).tooltip('show');
		},
		render: function() {
			this.$el.html(personasTemplate(this.collection.toJSON()));
		}

	});

});
