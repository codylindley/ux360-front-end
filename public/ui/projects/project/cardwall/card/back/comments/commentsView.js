define(function (require) {

	'use strict';

	// ******************************
	// Region Dependencies
	// ******************************

	// Backbone (View)
	var BaseView = require('backboneBaseObjects/baseView');


	// template
	var commentsTemplate = require('html!./commentsTemplate');

	// for communication between modules
	var mediator = require('utilities/mediator');

	require('handlebarsHelpers/formatDate');

	// Comments Collection
	var CommentsCollection = require('collections/commentsCollection');

	// Comment Model
	var CommentModel = require('models/commentModel');

	return BaseView.extend({

		initialize: function(options){

			var stry_id = this.stry_id = options.stry_id;

			// setup the comments collection for this story
			this.collection = new CommentsCollection([], {uxcm_referencepk: stry_id});

			this.listenTo(this.collection, 'sync', this.render);
			this.listenTo(this.collection, 'add', this.render);
			this.listenTo(this.collection, 'remove', this.render);

			// listen for the flip card event to get the latest
			// comments from the server
			mediator.on('card:flip', function(flipInfo){
				if(flipInfo.stry_id !== stry_id){ return; }
				this.collection.fetch();
			}, this);

		},

		events: {
			'submit .form-comments': 'addComment',
			'click .delete-comment': 'deleteComment',
			'click .acknowledge-comment': 'acknowledgeComment'
		},

		acknowledgeComment: function(e){
			e.preventDefault();

			// this is the comment ID
			var uxcm_id = $(e.currentTarget).data('uxcm_id');

			// pull the model from the collection
			var commentModel = this.collection.get(uxcm_id);

			// this will be triggered by the response from the
			// server once the comment is deleted
			this.listenTo(commentModel, 'sync', function(){
				// remove the deleted comment from the collection
			});

			// tell the server to delete the comment
			commentModel.update('uxcm_importedfromagile', 0);
		},

		deleteComment: function(e){
			e.preventDefault();

			// this is the comment ID
			var uxcm_id = $(e.currentTarget).data('uxcm_id');

			// pull the model from the collection
			var commentModel = this.collection.get(uxcm_id);

			// this will be triggered by the response from the
			// server once the comment is deleted
			this.listenTo(commentModel, 'sync', function(){
				// remove the deleted comment from the collection
				this.collection.remove(commentModel);
				mediator.trigger('card:commentCountChanged', {
					id: this.stry_id,
					count: this.collection.length
				});
			});

			// tell the server to delete the comment
			commentModel['delete']();

		},

		addComment: function(e){

			e.preventDefault();
			var uxcm_comment = $.trim(this.$('[name=uxcm_comment]').val());
			if(!uxcm_comment){
				alert('Please enter a comment');
				return;
			}
			var commentModel = new CommentModel({
				uxcm_referencepk: this.stry_id,
				uxcm_comment: uxcm_comment
			});

			// this will be triggered by the response from the
			// server once the comment is deleted
			this.listenTo(commentModel, 'sync', function(){
				// remove the deleted comment from the collection
				this.collection.add(commentModel);
				mediator.trigger('card:commentCountChanged', {
					id: this.stry_id,
					count: this.collection.length
				});
			});

			commentModel.create();

		},

		render: function() {
			this.$el.html(commentsTemplate(this.collection.toJSON()));
		}

	});

});
