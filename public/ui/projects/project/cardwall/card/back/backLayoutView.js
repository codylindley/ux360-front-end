define(function (require) {
	'use strict';

	//=====================
	// Layout Dependencies.
	//=====================

	// Style.
	require('css!./backLayoutStyle');

	// View.
	var BaseView = require('backboneBaseObjects/baseView');

	// Template.
	var backLayoutTemplate = require('html!./backLayoutTemplate');

	// For communication between modules.
	var mediator = require('utilities/mediator');

	// For dragging the flipped card.
	require('jqueryui/draggable');

	// For resizing flipped card.
	require('jqueryui/resizable');

	//===============================
	// Sub Views (Regions & Layouts).
	//===============================

	// Header.
	var HeaderView = require('./header/headerView');
	var headerView;

	// Story details.
	var DetailsView = require('./details/detailsView');
	var detailsView;

	// Story comments.
	var CommentsView = require('./comments/commentsView');
	var commentsView;

	// Story attachments.
	var AttachmentsView = require('./attachments/attachmentsView');
	var attachmentsView;

	// Story personas.
	var PersonasView = require('./personas/personasView');
	var personasView;

	// Build the view.
	return BaseView.extend({
		flip: function(flipInfo) {
			this.flipInfo = flipInfo;

			this.$('.card-front').html(flipInfo.html);

			this.$el.addClass(flipInfo.cardClassName).css({
				height: flipInfo.height,
				width: flipInfo.width
			});

			var $el = this.$el.show().css({
				top: flipInfo.offsetTop - $(window).scrollTop(),
				left: flipInfo.offsetLeft - $(window).scrollLeft()
			});

			var top = 50;
			var width = 700;
			var doc = $(document.documentElement);
			var height = doc.height() - (top * 2);
			var left = (doc.width() / 2) - (width / 2);

			$el.addClass('flipped').animate({
				top: top,
				height: height,
				width: width,

				// Center it on the screen.
				left: left
			},

			// Speed.
			500,

			// Callback.
			function() {
				$el.draggable();
				$el.resizable();
			});
		},

		unFlip: function(deleteAfterFlip) {
			var stry_id = this.model.id || this.model.cid;

			var $el = this.$el;
			$el.removeClass('flipped');

			// Animate back to the card's position in the card wall.
			$el.animate({
				height: this.flipInfo.height,
				width: this.flipInfo.width,
				top: this.flipInfo.offsetTop - $(window).scrollTop(),
				left: this.flipInfo.offsetLeft - $(window).scrollLeft()
			},

			// Speed.
			500,

			// Callback.
			function() {
				$el.hide();
				$el.draggable('destroy');
				$el.resizable('destroy');

				mediator.trigger('cardwall:unFlipCard', stry_id);

				if (deleteAfterFlip) {
					mediator.trigger('cardwall:deleteCard', stry_id);
				}
			});
		},

		events: {
			'click .btn-unflip': 'unFlipCard',
			'click .btn-delete': 'unFlipAndDeleteCard'
		},

		unFlipCard: function(e) {
			this.unFlip();
		},

		unFlipAndDeleteCard: function() {
			this.unFlip(true);
		},

		render: function() {
			this.model = this.options.model;

			var stry_id = this.model.id || this.model.cid;

			mediator.on('card:flip', function(flipInfo) {
				if (flipInfo.stry_id === stry_id) {
					this.flip(flipInfo);
				}
				else if (this.$el.hasClass('flipped')) {
					this.unFlip();
				}
			}, this);

			// Render the layout.
			this.$el.html(backLayoutTemplate({}));

			// Instantiate sub views.
			headerView = new HeaderView({
				el: this.$el.find('div[data-view="headerView"]'),
				model: this.model
			});

			headerView.render();

			detailsView = new DetailsView({
				el: this.$el.find('div[data-view="detailsView"]'),
				model: this.model
			});

			if (this.model.id) {
				personasView = new PersonasView({
					el: this.$el.find('div[data-view="personasView"]'),
					stry_id: stry_id
				});

				commentsView = new CommentsView({
					el: this.$el.find('div[data-view="commentsView"]'),
					stry_id: stry_id
				});

				attachmentsView = new AttachmentsView({
					el: this.$el.find('div[data-view="attachmentsView"]'),
					stry_id: stry_id
				});
			}
		}

	// END: return.
	});

// END: define.
});