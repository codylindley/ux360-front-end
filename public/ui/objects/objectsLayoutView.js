define(function (require) {

	'use strict';

	//inherits from:
	var BaseView = require('backboneBaseObjects/baseView');

	//layout template
	var objectsLayoutTemplate = require('html!./objectsLayoutTemplate');

	//////*view's (i.e. regions) in project list layout*///////

	//region/view
	var ObjectsMenuView = require('./objectsMenu/objectsMenuView');
	var objectsMenuView;

	var ObjectsBreadCrumbView = require('./objectsBreadCrumb/objectsBreadCrumbView');
	var objectsBreadCrumbView;

	var ObjectGrid = require('./objectGrid/objectGridView');
	var objectGrid;

	var CreateObjectBtn = require('./createObjectBtn/createObjectBtnView');
	var createObjectBtn;

	var ObjectAttsLockView = require('./objectAttsLock/objectAttsLockView');
	var objectAttsLockView;

	var CreateObjectModalView = require('./createObjectModal/createObjectModalView');
	var createObjectModalView;

	var ObjectPropertiesModalView = require('./objectPropertiesModal/objectPropertiesModalView');
	var objectPropertiesModalView;

	var ObjectCommentsModalView = require('./objectCommentsModal/objectCommentsModalView');
	var objectCommentsModalView;

	var ObjectHistoryModalView = require('./objectHistoryModal/objectHistoryModalView');
	var objectHistoryModalView;

	var ObjectDuplicateModalView = require('./objectDuplicateModal/objectDuplicateModalView');
	var objectDuplicateModalView;

	var ObjectAssociationsView = require('./objectAssociations/objectAssociationsView');
	var objectAssociationsView;

	var ObjectAttsView = require('./objectAttributes/objectAttsView');
	var objectAttsView;

	var ObjectAttsStockPhotoModalView = require('./objectAttsStockPhotoModal/objectAttsStockPhotoModalView');
	var objectAttsStockPhotoModalView;


	//////* end view's in project list layout*///////

	return BaseView.extend({

		render:function(){

			//append layout
			this.$el.html(objectsLayoutTemplate({}));

			// instantiate sub regions...

			/* view regions */

			objectsMenuView = new ObjectsMenuView({
				el: this.$('.objectsView'),
				type:this.options.type
			});

			objectsBreadCrumbView = new ObjectsBreadCrumbView({
				el: this.$('.objectsBreadCrumbView')
			}).render();
			
			objectGrid = new ObjectGrid({
				el: this.$('.objectGridView')
			}).render(this.options.type, this.options.objectName, this.options.objectId);

			createObjectBtn = new CreateObjectBtn({
				el: this.$('.createObjectBtn')
			}).render(this.options.type, this.options.objectName, this.options.objectId);

			createObjectModalView = new CreateObjectModalView({
				el: $('<div class="modal fade" id="createObjectModal" />').appendTo('body')
			});

			objectCommentsModalView = new ObjectCommentsModalView({
				el: $('<div class="modal fade" id="objectCommentsModal" />').appendTo('body')
			});

			objectHistoryModalView = new ObjectHistoryModalView({
				el: $('<div class="modal fade" id="objectHistoryModal" />').appendTo('body')
			});

			objectPropertiesModalView = new ObjectPropertiesModalView({
				el: $('<div class="modal fade" id="objectPropertiesModal" />').appendTo('body')
			});

			objectDuplicateModalView = new ObjectDuplicateModalView({
				el: $('<div class="modal fade" id="objectDuplicateModal" />').appendTo('body')
			});

			objectAttsLockView = new ObjectAttsLockView({
				el: this.$('.objectAttsLockView')
			}).render(this.options.type, this.options.objectName, this.options.objectId);

			objectAttsView = new ObjectAttsView({
				el: this.$('.objectAttributesView')
			}).render(this.options.type, this.options.objectName, this.options.objectId);

			objectAssociationsView = new ObjectAssociationsView({
				el: this.$('.objectAssociationsView')
			}).render(this.options.type, this.options.objectName, this.options.objectId);

			objectAttsStockPhotoModalView = new ObjectAttsStockPhotoModalView({
				el: $('<div class="modal fade" id="stockPhotosModal" />').appendTo('body')
			});

			return this;
			
		}

	});

});


