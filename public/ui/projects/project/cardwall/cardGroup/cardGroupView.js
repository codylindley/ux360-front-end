define(function (require) {
	'use strict';

	//=====================
	// Region Dependencies.
	//=====================

	// Backbone (View).
	var BaseView = require('backboneBaseObjects/baseView');

	// For communication between components.
	var mediator = require('utilities/mediator');

	// User stories collection.
	var StoriesCollection = require('collections/storiesCollection');

	// Build the view.
	return BaseView.extend({
		initialize: function(options){
			var stories = options.stories || [];

			this.collection = new StoriesCollection(stories, {
				prjt_id: options.prjt_id
			});

			// If stories are passed as an option, this means that this
			// card group is nested within another card. As such we can
			// render immediately given that we already have the stories.
			if (stories.length){
				this.render();
				return;
			}

			if (options.prjt_id){
				this.listenTo(this.collection, 'sync', function(){
					this.$el.empty();
					this.render();
					mediator.trigger('cardwall:allCardsRendered');
				}, this);

				// Fetch the stories from the server.
				this.collection.read();
			}
		},

		render: function() {
			this.$el.empty();

			// NOTE! We're recursively rendering nested stories.
			// Iterate thru the collection.
			this.collection.each(function(model){
				var stry_id = model.id || model.cid;

				// This tells `cardwallLayoutView` where to render
				// a new card layout. It supplies the `el` for proper
				// placement and the card's model.
				mediator.trigger('cardwall:createCard',{
					el: $('<li class="card" data-stry_id="'+stry_id+'"></li>').appendTo(this.$el),
					model: model
				});
			}, this);
		}

	// END: return.
	});

// END: define.
});