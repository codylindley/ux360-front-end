define(function (require) {
	'use strict';

	//=====================
	// Region Dependencies.
	//=====================

	// Backbone (View)
	var BaseView = require('backboneBaseObjects/baseView');

	// template
	var attachmentsTemplate = require('html!./attachmentsTemplate');

	// For communication between modules.
	var mediator = require('utilities/mediator');

	// Date formatter.
	require('handlebarsHelpers/formatDate');

	// Ajax uploader.
	require('jQueryUpload');

	// Supplies info needed by Liferay for uploading.
	var session = require('utilities/session');

	// Attachments collection.
	var AttachmentsCollection = require('collections/attachmentsCollection');

	// Comment model.
	var CommentModel = require('models/commentModel');

	// Build the view.
	return BaseView.extend({
		initialize: function(options) {
			var stry_id = this.stry_id = options.stry_id;

			// Setup the attachments collection for this story.
			this.collection = new AttachmentsCollection([],{referencepk: stry_id});

			this.listenTo(this.collection, 'sync', this.render);
			this.listenTo(this.collection, 'add', this.render);
			this.listenTo(this.collection, 'remove', this.render);

			// Listen for the flip card event to get
			// the latest attachments from the server.
			mediator.on('card:flip', function(flipInfo) {
				if (flipInfo.stry_id !== stry_id) {
					return;
				}

				this.collection.fetch();
			}, this);
		},

		events: {
			'submit .form-attachments': 'addAttachment',
			'click .delete-attachment': 'deleteAttachment'
		},

		addAttachment: function(e) {
			e.preventDefault();
		},

		deleteAttachment: function(e) {
			e.preventDefault();

			// This is the attachment ID.
			var uxme_id = $(e.currentTarget).data('uxme_id');

			var attachmentModel = this.collection.get(uxme_id);

			// This will be triggered by the response from
			// the server once the attachment is deleted.
			this.listenTo(attachmentModel, 'sync', function() {
				// Remove the deleted attachment from the collection.
				this.collection.remove(attachmentModel);
			});

			attachmentModel['delete']();
		},

		render: function() {
			var that = this;

			mediator.trigger('card:attachmentCountChanged', {
				id: this.stry_id,
				count: this.collection.length
			});

			that.$el.html(attachmentsTemplate({
				attachments: this.collection.toJSON(),
				referencePk: this.stry_id,
				session: session
			}));

			that.$('.input-file-upload').ajaxfileupload({
				valid_extensions: [
					'doc',
					'docx',
					'gif',
					'jpg',
					'jpeg',
					'pdf',
					'png',
					'txt'
				],
				action: window.frames.upload.MEDIA_URL,
				params: {
					actionType: 'addFileAndMedia',
					userId: session.userId,
					groupId: session.groupId,
					referencePk: this.stry_id,
					type: 'Userstory'
				},
				onComplete: function() {
					that.collection.fetch();
				}
			});
		}

	// END: return.
	});

// END: define.
});