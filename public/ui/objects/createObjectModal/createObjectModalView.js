define(function (require) {

	'use strict';

	require('growTextarea');
	var Ladda = require('ladda');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');
	require('css!./createObjectModalStyle');
	require('handlebarsHelpers/comparison');
	var veryifyDeleteTemplate = require('html!./verifyDeleteTemplate');

	var BaseView = require('backboneBaseObjects/baseView');
	var mediator = require('utilities/mediator');

	var createObjectModalTemplate = require('html!./createObjectModalTemplate');

	var didObjectChange = false;
    var childObject = '';
	
	return BaseView.extend({

		initialize: function(options){
			mediator.on('showCreateObjectModal', function(type){
				this.render(type);
			}, this);
		},

		events: {
			'click #createObjectBtn':'createObject',
			'click #createObjectBtnAndClose':'createObject',
			'click .deleteObject':'deleteObject',
			'click #showObjectModalSubCreateUI':'showObjectModalSubCreateUI',
			'click #hideObjectModalSubCreateUI':'hideObjectModalSubCreateUI',
			'submit': 'captureSubmitViaEnterKey'
		},

		deleteObject:function(e){

			var that = this;

			var $this = this.$(e.target);

			var arrangeTree = this.$el.find('#arrangeTree');
			var selectedElm = arrangeTree.find('.k-state-selected');
			var id = selectedElm.find('span').data('objectid');
			var type = selectedElm.find('span').data('objecttype');

			//grab button, start loader UI
			var loader = Ladda.create(this.$(e.target).get(0));
			loader.start();

			var objectsToRemove = {
				type: type,
				id: id
			};

			$.ajax({
				dataType:'json',
				type:'POST',
				url:buildURL({
					'serviceClassName': 'obre_objectrelationshipService',
					'serviceMethodName': 'deleteObjects',
					'serviceParameters': {
						objectMap: JSON.stringify([objectsToRemove]),
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(){
				arrangeTree.data('kendoTreeView').remove(arrangeTree.data('kendoTreeView').select());
				that.$('#removeObjectFromTree').prop("disabled", true);
				didObjectChange = true;

				loader.stop();
				that.$('#removeObjectFromTree').prop("disabled", true).popover('hide');
			});

		},

		showObjectModalSubCreateUI:function(e){
			var $this = $(e.target);
			$this.closest('.modal-header').find('button').removeClass('active');
			$this.addClass('active');

			this.$('#removeObjectFromTree').popover('hide');

			//must add data type before we change the type
			var type = $this.data('type');
			this.$el.find('#createObjectBtn,#createObjectBtnAndClose').data('type',type);
			//change type for odd objects, then use that in UI
			if(type === 'Personaset'){type = 'Persona Set';}
			if(type === 'Userstudy'){type = 'User Study';}

			//do gymnastics in ui because of odd objects
			this.$el.find('#addTitle span').text(type);
			this.$el.find('#createObjectModalSubCreateUI').animate({top:56}, 300);
			this.$el.find('#objectNameVal').focus();
			this.$el.find('#removeObjectFromTree, #closeCreateObjectModal').css('visibility','hidden');
		},

		hideObjectModalSubCreateUI:function(e){
			this.$el.find('.modal-header').find('button').removeClass('active');
			this.$el.find('#createObjectModalSubCreateUI').animate({top:-1000}, 400);
			this.$el.find('#objectNameVal,#objectDescriptionVal').val('');
			this.$el.find('#removeObjectFromTree, #closeCreateObjectModal').css('visibility','visible');
		},

		createObject:function(e){

			var that = this;

			var $this = this.$(e.target);

			//grab button, start loader UI
			var loader = Ladda.create($this.closest('button').get(0));
			loader.start();

			//disable everything while saving
			//this.$(':input').addClass('disabled').prop('disabled',true);
			var type = ($this.closest('button').data('type')).toLowerCase();
			var isContainer = this.$('#is_container').val();
			var containerChild = this.$('#container_child').val() ?  this.$('#container_child').val().toLowerCase(): '';
			
			var objectName = this.$('#objectNameVal').val();
			var objectDescription = this.$('#objectDescriptionVal').val();
			var arrangeTree = this.$el.find('#arrangeTree');
			var selectedElm = arrangeTree.find('.k-state-selected');
			var parent = 0; //default to top level, used by persona set and user study

			//find parent id in tree
			if(isContainer !== '1'){ 
				if(selectedElm.length !== 0){
					parent = selectedElm.find('span').data('objectid');
				}
			}

			//do something different for persona and participant
			if((isContainer === '1' && type === containerChild)){
				//if you try to select a participant or persona and add a child force it to add to parent
				if(selectedElm.find('span').data('objecttype').toLowerCase() === containerChild){
					parent = selectedElm.closest('ul').closest('li').find('span[data-objecttype]:first').data('objectid');
				}else{
					parent = selectedElm.find('span').data('objectid');
				}
			}
			
			$.ajax({
				dataType:'json',
				type:'POST',
				url:buildURL({
					'serviceClassName': 'obre_objectrelationshipService',
					'serviceMethodName': 'createObject',
					'serviceParameters': {
						type: type,
						title: objectName,
						description: objectDescription,
						template_id: 0,
						workingGroups: '',
						parent:parent,
						indexId:-1,
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(data){

				var dataNameDecoded = _.cloneDeep(data,function(obj){
					obj.Name = decodeURIComponent(obj.Name).replace(/\+/g,' ');	
				});

				var kUtree = arrangeTree.data('kendoTreeView');
				if(parent){
					if(selectedElm.find('span').data('objecttype').toLowerCase() === containerChild){//append to parent
						kUtree.append(dataNameDecoded,kUtree.parent(kUtree.select()));
					}else{//append to select
						kUtree.append(dataNameDecoded,kUtree.select());
					}
				}else{//just append at top level
					kUtree.append(dataNameDecoded);
				}

				loader.stop();
				didObjectChange = true;

				that.$el.find('#objectNameVal,#objectDescriptionVal').val('');

				if($this.closest('button').attr('id') === 'createObjectBtnAndClose'){
					that.$('#hideObjectModalSubCreateUI').trigger('click');
				}else{
					that.$el.find('#objectNameVal').focus();
				}

			});

		},

		captureSubmitViaEnterKey:function(e){
			this.$('#createObjectBtn').trigger('click');
			event.preventDefault();
		},

		render: function(type){

			var that = this;

			$.ajax({
				dataType:'json',
				type:'POST',
				url:buildURL({
					'serviceClassName': 'obre_objectrelationshipService',
					'serviceMethodName': 'findAllObjectsByTypeTree',
					'serviceParameters': {
						type: type,
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(response){

				var is_container = response.is_container;
			    childObject = response.type_child;
				
				//create modal
				that.$el
					.html(createObjectModalTemplate(response))
					.modal({
						width:($(window).width() - 265),
						height:($(window).height() - 265),
						backdrop:'static',
						keyboard:false
					});

				//clean up url encoded names
				var reponseWithNameDecoded = _.cloneDeep(response.result,function(obj){
					obj.Name = decodeURIComponent(obj.Name).replace(/\+/g,' ');	
				});

				//events for keyup and focus on name input
				that.$el.find('#objectNameVal').on('keyup focus',function(e){
					if(that.$(e.target).val() === ''){
						that.$('#createObjectBtn, #createObjectBtnAndClose')
						.addClass('disabled')
						.prop('disabled',true);
					}else{
						that.$('#createObjectBtn, #createObjectBtnAndClose')
						.removeClass('disabled')
						.prop('disabled',false);
					}
				});

				that.$('#removeObjectFromTree')
				.popover({
					placement: 'bottom',
					html: 'true',
					title: 'Are you Sure?',
					content : veryifyDeleteTemplate
				}).on('hide.bs.popover',$.proxy(function(e){
					var $this = this.$(e.target);
					$this.empty().text('delete');
				},that)).on('show.bs.popover',$.proxy(function(e){
					var $this = this.$(e.target);
					$this.html('<strong>cancel</strong>');
				},that));

				//create tree...
				var arrangeTree = that.$el.find('#arrangeTree').kendoTreeView({
					dataSource: reponseWithNameDecoded,
					template: '<span data-refreshdate="#: item.refresh_date #" data-objectid="#: item.id #"  data-iscontainer="#: ' + is_container+' #" data-objecttype="#: item.type #">#= item.Name #</span>',
					dragAndDrop: (!is_container) ? true : false,
					select: _.bind(that.itemInTreeSelected,that)
				}).data("kendoTreeView");

				
				//if the tree is not personaset or userstudy then add the drag and drop feature for arranging
				if(!is_container){

					var $parentNodeSource;

					arrangeTree.bind('dragstart',function(e){
						var $this = $(e.sourceNode);
						$parentNodeSource = $this.closest('ul').closest('li').find('span[data-objecttype]:first');

					});

					arrangeTree.bind('dragend',function(e){
						var $this = $(e.sourceNode);

						var $movedNode = $this.find('.k-in:first span');
						var $parentNode = $this.closest('ul').closest('li').find('span[data-objecttype]:first');
						var index = $this.index();

						var parentId = $parentNode.length ? $parentNode.data('objectid') : 0;
						var id = $movedNode.length ? $movedNode.data('objectid') : 0;

						var sourceBranch = $parentNodeSource.parents('li').last().find('.k-in:first span').data('refreshdate');
						var destinationBranch = $movedNode.parents('li').last().find('.k-in:first span').data('refreshdate');

						if(sourceBranch === undefined || sourceBranch === "undefined"){
							sourceBranch = $movedNode.data('refreshdate');
						}

						if(destinationBranch === undefined || destinationBranch === "undefined"){
							destinationBranch = 0;
						}

						$.ajax({
							dataType:'json',
							type:'POST',
							url:buildURL({
								'serviceClassName': 'obre_objectrelationshipService',
								'serviceMethodName': 'updateObjectHierarchy',
								'serviceParameters': {
									type: type,
									object_id: id,
									object_parent: parentId,
									last_refresh_source: sourceBranch,
									last_refresh_destination: destinationBranch,
									index:index,
									groupId: session.groupId,
									userId: session.userId
								}
							})
						}).done(function(data){
							didObjectChange = true;
						});

					});
				}

				that.$el.on('hidden.bs.modal',function(e){
					if(didObjectChange){
						mediator.trigger('renderGridList',type);
						didObjectChange = false;
					}
				});
				
			});
		},

		itemInTreeSelected:function(e){
			this.$el.find('#removeObjectFromTree').prop("disabled", false);
			var type = this.$(e.node).find('span[data-objecttype]:first').data('objecttype');
			var is_container = this.$(e.node).find('span[data-iscontainer]:first').data('iscontainer');
			if(is_container){
				this.$el.find('button[data-type="' + childObject +'"]').prop("disabled", false);
			}
		}

	});

});
