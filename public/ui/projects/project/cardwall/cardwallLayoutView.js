define(function (require) {
	'use strict';

	// ====================
	// Layout Dependencies.
	// ====================

	// Style.
	require('css!./cardwallLayoutStyle');

	// View.
	var BaseView = require('backboneBaseObjects/baseView');

	// Template.
	var cardwallLayoutTemplate = require('html!./cardwallLayoutTemplate');

	// For communication between components.
	var mediator = require('utilities/mediator');

	// For drag and drop between cards & cardGroups.
	require('jqueryui/sortable');

	// Lo-Dash.
	var _ = require('underscore');

	//===============================
	// Sub Views (Regions & Layouts).
	//===============================

	// Project overview toolbar.
	var ToolbarView = require('./toolbar/toolbarView');
	var toolbarView;

	// Card group.
	var CardGroupView = require('./cardGroup/cardGroupView');
	var cardGroupView;

	// Card.
	var CardLayoutView = require('./card/cardLayoutView');

	// Confirmation after save.
	var NotificationView = require('./notification/notificationView');

	//====================
	// Variables in scope.
	//====================

	var prjt_id;

	// Build the view.
	return BaseView.extend({
		createCardGroupView: function(options) {
			// Create a new cardGroup with the supplied options.
			var cardGroupView = new CardGroupView(options);
		},

		createCardLayoutView: function(options) {
			// Create a new cardGroup with the supplied options
			var cardLayoutView = new CardLayoutView(options);
			cardLayoutView.render();

			if (this.isDragAndDropInitialized) {
				this.destroyCardDragAndDrop();
				this.initCardDragAndDrop();
			}

			// Auto flip newly created cards.
			if (!options.model.id) {
				mediator.trigger('cardwall:flipCard', options.model.cid);
			}
		},

		storyDictionary: {},

		registerCard: function(model) {
			this.storyDictionary[model.id || model.cid] = model;
		},

		deleteCard: function(stry_id) {
			var card = this.$('li[data-stry_id="'+stry_id+'"]');
			card.addClass('deleted-card');

			var model = this.storyDictionary[stry_id];
			model.set('action', -1);
		},

		getStoryMap: function(ul) {
			var storyDictionary = this.storyDictionary;
			var that = this;
			var stories = [];

			ul = ul || this.$('ul[data-view="cardGroupView"]')[0];

			$(ul).children('li').each(function() {
				var model = storyDictionary[$(this).data('stry_id')];

				if (model) {
					var story = model.toJSON();
					story.Userstories = [];

					var childUl = $(this).children('ul')[0];

					if (childUl) {
						story.Userstories = that.getStoryMap(childUl);
					}

					stories.push(story);
				}
			});

			return stories;
		},

		cancel: function() {
			this.storyDictionary = {};
			this.render();
		},

		save: function() {
			// Traverse the DOM to get the current
			// arrangement of all the cards.
			var storyMap = this.getStoryMap();

			this.storyDictionary = {};
			var $el = this.$el;

			cardGroupView.collection.update(storyMap).done(function(response) {
				cardGroupView.collection.reset(response);

				var notification = new NotificationView({
					message: 'Successfully Saved!',
					el: $('<div class="alert alert-success alert-dismissable fade in"></div>').prependTo($el)
				});

				// Show the notification.
				notification.render();

				// Hide the notification.
				_.delay(function() {
					notification.$el.removeClass('in');

					_.delay(function() {
						notification.remove();
					}, 400);
				}, 2500);
			});
		},

		exportSuccess: function(response) {
			var alertType = response.success ? 'success' : 'danger';
			var message = response.success ? 'Export Successful!' : 'Export Failed!';

			new NotificationView({
				message: message,
				el: $('<div class="alert alert-'+alertType+' alert-dismissable fade in" />').prependTo(this.$el)
			});
		},

		render: function() {
			// Determined by the router, passed along by the parent view.
			prjt_id = this.options.prjt_id;

			// NOTE! Both cardViews and cardGroupViews emit these events
			// when they have nested cardGroups and/or cards. This layout
			// listens for these events and creates a new cardGroup and/or
			// card view according to the options passed to the mediator.

			mediator.on('cardwall:createCard', this.createCardLayoutView, this);
			mediator.on('cardwall:createGroup', this.createCardGroupView, this);

			mediator.on('cardwall:reloadCards', this.reloadCards, this);

			mediator.on('cardwall:allCardsRendered', this.initCardDragAndDrop, this);
			mediator.on('cardwall:registerCard', this.registerCard, this);
			mediator.on('cardwall:deleteCard', this.deleteCard, this);
			mediator.on('cardwall:flipCard', this.flipCard, this);
			mediator.on('cardwall:unFlipCard', this.unFlipCard, this);
			mediator.on('cardwall:save', this.save, this);
			mediator.on('cardwall:cancel', this.cancel, this);
			mediator.on('cardwall:exportSuccess', this.exportSuccess, this);

			// Render the layout.
			this.$el.html(cardwallLayoutTemplate());

			// Instantiate sub views.
			toolbarView = new ToolbarView({
				prjt_id: prjt_id,
				el: this.$('div[data-view="toolbarView"]')
			});

			toolbarView.render();

			cardGroupView = new CardGroupView({
				prjt_id: prjt_id,
				el: this.$('ul[data-view="cardGroupView"]')
			});
		},

		getCardDepth: function(card) {
			// Calculate how many cards are nested within a card.
			if (card.find('.card .card .card .card .card')[0]) { return 6; }
			if (card.find('.card .card .card .card')[0]) { return 5; }
			if (card.find('.card .card .card')[0]) { return 4; }
			if (card.find('.card .card')[0]) { return 3; }
			if (card.find('.card')[0]) { return 2; }

			// Default to 1.
			return 1;
		},

		isOkToDrop: function (card) {
			// Check to see if there is a card nested more than 5 levels deep.
			return !card.find('.card .card .card .card .card')[0];
		},

		overCard: function(e, ui) {
			// level of card depth for drop target area
			var targetCardDepth = ui.placeholder.parents('.card').length;

			// levels of nested cards for item to be dropped
			var originCardDepth = this.getCardDepth(ui.item);

			// If adding one card to the other would
			// create a depth of more than 5 levels.
			if (targetCardDepth + originCardDepth > 5) {
				// Then show add a warning class.
				ui.item.addClass('card-cant-drop');
			}
			else {
				// Otherwise, remove it.
				ui.item.removeClass('card-cant-drop');
			}
		},

		dropCard: function(e, ui) {
			var card = ui.item;

			// Remove warning class, just in case it was applied.
			card.removeClass('card-cant-drop');

			// Get the parent of the dropped card.
			var parentCard = card.parents('.card');

			// If it's not okay to drop, `return false` to
			// cancel the jQuery UI sortable functionality.
			if (!this.isOkToDrop(parentCard)) {
				return false;
			}

			// Drop is valid, now update the collections.
			var model = this.storyDictionary[card.data('stry_id')];

			if (model.id) {
				model.set('action', 1);
			}
		},

		destroyCardDragAndDrop: function() {
			this.$('.ui-sortable').sortable('destroy');
		},

		isDragAndDropInitialized: false,

		initCardDragAndDrop: function() {

			this.$('.card-group').sortable({
				connectWith: '.card-group',
				placeholder: 'card-drop-assist',
				over: _.bind(this.overCard, this),
				stop: _.bind(this.dropCard, this)
			}).disableSelection();

			this.isDragAndDropInitialized = true;
		},

		unFlipCard: function(stry_id) {
			var card = this.$('li[data-stry_id='+stry_id+']');
			card.removeClass('card-flipped');
		},

		cardClasses: [
			'first-level-card',
			'second-level-card',
			'third-level-card',
			'fourth-level-card',
			'fifth-level-card'
		],

		flipCard: function(stry_id) {
			var card = $('li[data-stry_id='+stry_id+']');

			// Mark the card as flipped visually in the card wall.
			card.addClass('card-flipped');

			// Determine the level of depth by
			// counting how many parent cards.
			var cardClass = this.cardClasses[card.parents('.card').length];

			// Emit flip event, passing the info needed for flipping.
			mediator.trigger('card:flip', {
				html: card.find('.card-front').html(),
				cardClassName: cardClass,
				stry_id: stry_id,
				height: card.height(),
				width: card.width(),
				offsetTop: card.offset().top,
				offsetLeft: card.offset().left
			});
		}

	// END: return.
	});

// END: define.
});