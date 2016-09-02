define(function (require) {

	'use strict';
	
	var mediator = require('utilities/mediator');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');
	var _ = require('underscore');
	require('kendoui/kendo.treeview');

	//css
	require('css!./objectAssociationsViewStyle');

	//inherits from:
	var BaseView = require('backboneBaseObjects/baseView');

	var currentType;
	var currentObjectId;
	var Ascending;

	//layout template
	var objectAssociationsTemplate = require('html!./objectAssociationsTemplate');

	return BaseView.extend({

		initialize: function(options){

			mediator.on('renderObjectAssociations',function(type,objectName,objectId){
				this.render(type,objectName,objectId);
			},this);

			mediator.on('removeObjectAssociations',function(type,objectName,objectId){
				this.$el.empty();
			},this);

		},

		events:{
			'click #assAccordion .panel-heading':'triggerOpenOnAccordion',
			'click #assAccordion input:checkbox':'associate',
			'click .collapseTreeBtn':'collapseTree',
			'click .expandTreeBtn':'expandTree',
			'click .sortTreeBtn':'sortTree',
			'click .filterTreeBtn':'filterTree'

		},

		collapseTree:function(e){
			$(e.target).closest('.panel-body').find('.assTree').data("kendoTreeView").collapse(".k-item");
		},

		expandTree:function(e){
			$(e.target).closest('.panel-body').find('.assTree').data("kendoTreeView").expand(".k-item");
		},

		/*
		filterTree:function(e){

			var filterText = $(e.target).closest('div').find('input').val();

			var tree = $(e.target).closest('.panel-body').find('.assTree').data("kendoTreeView");

			if (filterText !== "") {
				tree.dataSource.filter({
					field: "Name",
					operator: "contains",
					value: filterText
				});
			} else {
				tree.dataSource.filter({});
			}

		},

		sortTree:function(e){

			var sortType = $(e.target).data('sort');
			var sortTypetoggle = sortType === 'asc' ? "desc" : "asc";
			var sortIcon = sortType === 'asc' ? 'glyphicon glyphicon-sort-by-attributes' : 'glyphicon glyphicon-sort-by-attributes-alt';

			$(e.target)
				.data('sort',sortTypetoggle)
				.find('span')
				.removeClass()
				.addClass(sortIcon)
				.end()
				.closest('.panel-body')
				.find('.assTree')
				.data("kendoTreeView")
				.dataSource.sort({
					field: "Name",
					dir: sortType === 'asc' ? "asc" : "desc"
				});

		},*/

		associate:function(e){

			var $this = $(e.target);

			var associateArray = [];

			var checkboxs = $this.parents('li').last().find('input').not('[data-hide="true"]');

			setTimeout(function(){//have to wait for all browsers to check or uncheck all check boxes

				checkboxs.each(function(i,v){
					$(this).prop("disabled", true);
				});

				checkboxs.each(function(i,v){
					var $this = $(this);
					var id = $this.data('id');
					var type = $this.data('type');
					var action = $this.get(0).checked ? 0 : -1;
					associateArray.push({"id":id,"type":type,"action":action});
				});

				$.ajax({
					dataType:'json',
					url:buildURL({
						serviceClassName: 'obre_objectrelationshipService',
						serviceMethodName: 'associateObjects',
						serviceParameters: {
							object_type: currentType,
							object_id: currentObjectId,
							objectMap: JSON.stringify(associateArray),
							groupId: session.groupId,
							userId: session.userId
						}
					})
				}).done(function(response){
					$this.closest('.panel-collapse').prev('.panel-heading').find('.badge').text(response.association_count);
					checkboxs.each(function(i,v){
						$(this).prop("disabled", false);
					});
				});

			},100);

		},

		render:function(type,objectName,objectId){

			//if type and object are missing then cancel render
			if(!_.all([type,objectName,objectId])){return this;}

			currentType = type;
			currentObjectId = objectId;

			$.ajax({
				dataType:'json',
				url:buildURL({
					serviceClassName: 'obre_objectrelationshipService',
					serviceMethodName: 'findAllAssociableObjectsCount',
					serviceParameters: {
						object_type: type,
						object_id: objectId,
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done($.proxy(function(response){

				this.$el.html(objectAssociationsTemplate({objectCount:response.associations}));

			},this));

		},

		triggerOpenOnAccordion:function(e){

			var $panel = this.$(e.target).closest('.panel-heading').next('.panel-collapse').find('.panel-body');

			if($panel.find('.k-treeview').length === 0){

				$.ajax({
					dataType:'json',
					url:buildURL({
						serviceClassName: 'obre_objectrelationshipService',
						serviceMethodName: 'findAllAssociableObjectsByType',
						serviceParameters: {
							object_type: currentType,
							object_id: currentObjectId,
							required_object_type: $panel.data('required-object-type'),
							groupId: session.groupId,
							userId: session.userId
						}
					})
				}).done($.proxy(function(response){

					var hasChildren = false;

					_.each(response,function(obj){
						if(obj.items){
							$panel.find('.collapseTreeBtn,.expandTreeBtn').removeClass('hidden');
							return false;
						}
					});

					var reponseWithNameDecoded = _.cloneDeep(response,function(obj){
						obj.Name = decodeURIComponent(obj.Name).replace(/\+/g,' ');	
					});

					$panel.find('.assTree').kendoTreeView({
						checkboxes: {
							checkChildren: true,
							template: '<input data-id="#= item.id #" data-type="#= item.type #" type="checkbox" #if(item.status === "checked"){# #:item.status # #}# #if(item.checkbox === false){# style="display:none;" data-hide="true" #}# />'
						},
						template: '#: item.Name #',
						dataSource: reponseWithNameDecoded,
						select: function(e) {
							e.preventDefault();
							$(':checkbox:first:visible', $(e.node)).click();
						}

					});

					/*
					assTree.data("kendoTreeView").dataSource.bind('change',function(e){

						var checked = this.getByUid(e.items[0].uid).checked;

						this.getByUid(e.items[0].uid).set('status',(checked ? 'checked' : ''));

					});*/

				},this));

			}

		}

	});

});


