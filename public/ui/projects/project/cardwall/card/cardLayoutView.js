define(function (require) {
	'use strict';

	//=====================
	// Layout Dependencies.
	//=====================

	// Style.
	require('css!./cardLayoutStyle');

	// View.
	var BaseView = require('backboneBaseObjects/baseView');

	// Template.
	var cardLayoutTemplate = require('html!./cardLayoutTemplate');

	// For communication between components.
	var mediator = require('utilities/mediator');

	//===============================
	// Sub Views (Regions & Layouts).
	//===============================

	// Front of the card.
	var FrontView = require('./front/frontView');
	var frontView;

	// Back of the card.
	var BackLayoutView = require('./back/backLayoutView');
	var backLayoutView;

	// Build the view.
	return BaseView.extend({
		events: {
			'dblclick :not(.flipped)': 'dblclickCard'
		},

		dblclickCard: function(e){
			// Prevent event from bubbling to parent cards.
			e.stopPropagation();

			if (!$(e.target).hasClass('glyphicon')){
				mediator.trigger('cardwall:flipCard', this.model.id || this.model.cid);
			}
		},

		render: function(){
			this.model = this.options.model;

			// Render the layout.
			this.$el.html(cardLayoutTemplate({}));

			// Pass `storyModel` to the regions below.
			frontView = new FrontView({
				el: this.$('div[data-view="frontView"]'),
				model: this.model
			});
			frontView.render();

			var noBackViewExists = !$('div[data-flip-id="'+this.model.id+'"]').length;
			var str = '<div class="flip-container" data-flip-id="'+this.model.id+'"></div>';

			if (noBackViewExists) {
				backLayoutView = new BackLayoutView({
					el: $(str).appendTo(document.body),
					model: this.model
				});
				backLayoutView.render();
			}

			// This tells `cardwallLayoutView` where to render
			// a new card group. It supplies the `el` for proper
			// placement and the stories that belong to the group.

			mediator.trigger('cardwall:createGroup', {
				el: this.$el.find('ul[data-view="cardGroupView"]'),
				stories: this.model.get('Userstories')
			});
		}

	// END: return.
	});

// END: define.
});