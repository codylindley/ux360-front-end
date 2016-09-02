define(function (require) {
	'use strict';

	var BaseView = require('backboneBaseObjects/baseView');

	require('handlebarsHelpers/encodeUrl');
	require('css!./objectsMenuStyle');

	var _ = require('underscore');
	var mediator = require('utilities/mediator');

	var objectsMeniTemplate = require('html!./objectsMenuTemplate');

	var ObjectsCollection = require('collections/objects/objectTypesCollection');
	var objectsCollection;

	// Build the view.
	return BaseView.extend({
		initialize: function(options){
			this.type = options.type;
			objectsCollection = new ObjectsCollection();
			this.listenTo(objectsCollection, 'sync', this.render);
			objectsCollection.fetch();

			mediator.on('triggerObjectsMenuViewClick',function(){
				this.$el.find('.active').trigger('click');
			},this);
		},

		render: function(){
			this.$el.html(objectsMeniTemplate(objectsCollection.toJSON()));

			// If the object type has a sub type, deal with the
			// fact we are hiding sub types in menu and breadcrumb.

			var link = this.$el.find('a[data-sub-type="'+this.type+'"]');

			if (link.length){
				this.makeMenuItemActive(link.data('route'));
			}
			else {
				this.makeMenuItemActive(this.type);
			}

			mediator.trigger('renderObjectsBreakCrumb',this.type);

			if (this.type === null){
				this.$('.list-group-item:first').trigger('click');
			}
		},

		events:{
			'click a':'selectObjectInMenu'
		},

		selectObjectInMenu:function(e){
			var type = this.$(e.target).data('route');

			// Remove views.
			mediator.trigger('removeObjectAssociations');
			mediator.trigger('removeObjectAtts');
			mediator.trigger('removeObjectAttsLock');
			mediator.trigger('removeObjectsBreakCrumb');

			// Update route.
			ux360.router.navigate('objects/'+type);

			// Render views.
			mediator.trigger('renderGridList',type);
			mediator.trigger('renderCreateObjectBtn',type);
			this.makeMenuItemActive(type);
		},

		makeMenuItemActive:function(type){
			this.$('a[data-route]')
			.removeClass('active')
			.filter('a[data-route="'+type+'"]')
			.addClass('active');
		}

	// END: return.
	});

// END: define.
});