define(function (require) {

	'use strict';
	
	var mediator = require('utilities/mediator');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');
	var _ = require('underscore');
	var $ = require('jquery');

	// handlebars Helper
	require('handlebarsHelpers/comparison');
	require('handlebarsHelpers/decodeUrl');
	require('handlebarsHelpers/objectAtts/attsCheckboxs');
	require('handlebarsHelpers/objectAtts/attsInputType');

	//jquery plugins
	require('textInputCounter'); 
	require('maskInputsAlphaNum');
	require('growTextarea');
	require('maskInputs');
	require('powertip');
	require('bootstrapGrowl');
	require('jQueryUpload');
	var Ladda = require('ladda');

	//variable used across scope below
	var uploadImgBtn;
	var deleteImgBtn;
	var objectTypeScope;
	var objectIdScope;

	//css
	require('css!./objectAttsViewStyle');

	//inherits from:
	var BaseView = require('backboneBaseObjects/baseView');

	//layout template
	var objectAttsTemplate = require('html!./objectAttsTemplate');
	var veryifyDeleteTemplate = require('html!./verifyDeleteTemplate');

	//region/view

	return BaseView.extend({

		initialize: function(options){

			mediator.on('removeObjectAtts', function(){
				this.undelegateEvents().$el.empty();
			},this);

			mediator.on('renderObjectAtts', function(type,objectName,objectId){
				this.delegateEvents().render(type,objectName,objectId);
			},this);

		},

		events:{
			'click .attsDisabledCover':'triggerEditMode',
			'click .changePhoto':'uploadPhoto',
			'click .deletePhotoNow':'deletePhoto',
			'click .stockPhoto': 'showStockPhotosModal',
			'click #attsAccordion .panel-heading':'triggerOpenOnAccordion'
		},

		triggerOpenOnAccordion:function(e){
			this.$(e.target).find('a').trigger('click');
		},

		showStockPhotosModal:function(e){
			mediator.trigger('showStockPhotosModal',this.objectType,this.objectId, e.target);
		},

		triggerEditMode:function(){
			$('#editModeSwithBtn').bootstrapSwitch('toggleState');
		},

		render:function(type,objectName,objectId){

			if(!_.all([type,objectId])){return this;}

			//need for scope issues, where I need these from this. and from func. scope
			this.objectType = objectTypeScope = type;
			this.objectId = objectIdScope = objectId;

			$.ajax({
				dataType:'json',
				url:buildURL({
					serviceClassName: 'obre_objectrelationshipService',
					serviceMethodName: 'getCompleteObjectData',
					serviceParameters: {
						type: type,
						referencePk: objectId,
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done($.proxy(function(response){

				var that = this;

				//create attributes collection, send to template
				var objectAttsCollectionJSON = response;

				//for breadcrumb, fixing it so it has correct object type name

				mediator.trigger('renderObjectsBreakCrumb',objectAttsCollectionJSON.typeTitle,
					objectAttsCollectionJSON.Parents.concat([{
						name:objectAttsCollectionJSON.name,
						id:objectAttsCollectionJSON.id,
						type:objectAttsCollectionJSON.type
					}])
				);


				this.$el.html(objectAttsTemplate({
					objectType: type,
					objectName: objectAttsCollectionJSON.name,
					collection:objectAttsCollectionJSON['Template Data']
				}));

				//setup counters on inputs that have maxlength
				this.$('input[maxlength],textarea[maxlength]').not('[type="date"],[type="number"]').maxlength();

				//setup alpha and numeric masking on inputs & textarea
				this.$(':text,textarea').alphanum({allow :'!&?\'":;,.$-()\/'});
				this.$('input[type="number"]').numeric('integer');

				//autogrow textarea & cover forms on page load to capture event when clicked
				this.$('#attsAccordion .collapse').on('shown.bs.collapse',function(e){//when accordion opens
					$(this).find('textarea').autoGrow();
					//add transparent cover over forms in each panel based on width and height of panel
					that.resizeAttsDisabledCover(e.target);
				});

				//open accordion panel, if only one panel
				if(this.$('#attsAccordion .panel').length === 1){
					this.$('.panel-title a').trigger('click');
				}

				//add cover to each accordion panel
				if(!this.$el.is('.attsAreLocked')){//if it can be edited
					this.$('.panel-body').each(function(){
						$(this).prepend('<div class="attsDisabledCover" title="click to edit"></div>');
					});
					$('.attsDisabledCover').powerTip({followMouse:true,offset:15});
				}

				//add event change event to checkbox, select, radio, fires on text inputs on blur
				this.$(':input').not('button,textarea,input[type="text"],input[type="file"]').on('change',$.proxy(this.saveAtts,this));

				//stop mouse wheel event on date and number inputs
				this.$('input[type="date"],input[type="number"]').on('mousewheel',function(){
					event.stopImmediatePropagation();
					return false;
				});

				//event to fire when a focused textarea or input[type="text"] has changed
				this.$(':input')
					.not('button,:checkbox,:radio,select,input[type="file"]')
					.on($('html').is('.lt-ie9')?'keyup blur':'input',$.proxy(that.autoSave,this))
					.data('powertip', 'saving...')
					.powerTip({
						manual:true,
						popupId:'powerTipSaving',
						placement:'n',
						offset:-1
					});
							
				//have the invisible overlay resize with window
				$(window).on('resize.baseView',function(){
					that.resizeAttsDisabledCover();
				});
				
				//add events to file input for each attributes image
				this.$('.uploadFile').ajaxfileupload({
					'action': window.frames.upload.MEDIA_URL,
					'params': {
						actionType:'addImage',
						userId: session.userId,
						groupId: session.groupId,
						type: type
					},
					'onComplete': this.uploadPhotoComplete,
					'onStart': this.startphotoUploadLoaderBtn
					
				});
				
				/*this.$('.uploadFile').kendoUpload({
					async: {
						saveUrl: window.frames.upload.MEDIA_URL,
						removeUrl: "remove",
						autoUpload: true
					},
					cancel:function(e){
						console.log(e);
					},
					complete:function(e){
						console.log(e);
					},
					error:function(e){
						console.log(e);
					},
					progress:function(e){
						console.log(e);
					},
					upload:function(e){
						e.data = {
							actionType:'addImage',
							userId: session.userId,
							groupId: session.groupId,
							type: type
						};
					},
					success: this.uploadPhotoComplete,
					showFileList: false,
					multiple: false
				});*/

				this.$('.deletePhoto').popover({
					placement: 'right',
					html: 'true',
					title: 'Are you Sure?',
					content : veryifyDeleteTemplate
				}).on('hide.bs.popover',$.proxy(function(e){
					var $this = this.$(e.target);
					$this.empty().text('delete');
				},this)).on('show.bs.popover',$.proxy(function(e){
					var $this = this.$(e.target);
					$this.html('cancel');
				},this));
				
			},this));

		},

		uploadPhoto:function(e){ //use our button to trigger click on hidden input
			this.$(e.target).closest('div').find('input:file').parent('label').trigger('click');
			return false;
		},

		//when the file input has uploaded photo, get response containing ID, then update actual attribute
		//with data from the uploaded image
		uploadPhotoComplete:function(response){
			
			var that = this; //this is input:file
			var $table = $(this).closest('table');
			var $img = $table.find('img');
			var imgId = $table.find('input').data('id');
			var inputCactId = $table.data('cact-id');
			var data = {id:imgId,value:response[0].image_id};
			var resetFileInput = function (e) {
				e.wrap('<form>').parent('form').trigger('reset');
				e.unwrap();
			};

			$.ajax({
				dataType:'json',
				type:'POST',
				url:buildURL({
					'serviceClassName': 'obre_objectrelationshipService',
					'serviceMethodName': 'addOrUpdateDataObject',
					'serviceParameters': {
						type: objectTypeScope,
						referencepk: objectIdScope,
						cact_id: inputCactId,
						dataObject:JSON.stringify(data),
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(){	
				$table
					.find('img')
					.attr('src',response[0].path_small)
					.end()
					.find('.deletePhoto')
					.show()
					.end()
					.find('.changePhoto')
					.text('upload image');

				resetFileInput(that);

				uploadImgBtn.stop();
				uploadImgBtn = undefined;
			});

		},

		//this event starts when a photo is actually selected from OS file system
		startphotoUploadLoaderBtn:function(){
			uploadImgBtn = Ladda.create($(this).closest('div').find('.changePhoto')[0]);
			uploadImgBtn.start();
		},

		//remove a photo
		deletePhoto:function(e){ //e is event from jQuery
			//start loader
			var deleteImgBtn = Ladda.create( $(e.target)[0] );
			deleteImgBtn.start();

			var $div = $(e.target).closest('.attsImage');
			var imgId = $div.find('input').data('id');
			var inputCactId = $div.data('cact-id');
			var data = {id:imgId,value:''};

			$.ajax({
				dataType:'json',
				type:'POST',
				url:buildURL({
					'serviceClassName': 'obre_objectrelationshipService',
					'serviceMethodName': 'addOrUpdateDataObject',
					'serviceParameters': {
						type: this.objectType,
						referencepk: this.objectId,
						cact_id: inputCactId,
						dataObject:JSON.stringify(data),
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(){
				deleteImgBtn.stop();
				$div.find('.deletePhoto').popover('hide');
				$div
				.find('img').attr('src',$div.find('img').data('default-img'))
				.end()
				.find('.deletePhoto')
					.text('delete')
					.hide()
				.end()
				.find('.changePhoto').text('upload image')
				.end()
				//so important to clear input like reset file input, if not re-occurring uploads have issues
				.find('input').wrap('<form>').closest('form').get(0).reset();

				$div.find('input').unwrap();
			});

			event.preventDefault();
		},

		autoSave:function(e){
			$.powerTip.show($(e.target));
			this.saveAtts(e);
		},

		saveAtts: _.throttle(function(e){//save changes to server via api

			var that = this;
			var $inputElement = $(e.target);
			var data = {id:0,value:''};
			var inputValue;
			var inputCactId = $inputElement.data('cact-id');
			var inputId;

			if($inputElement.is(':text,textarea,:radio,input[type="number"]')){ //text input
				data.value = $inputElement.val();
				data.id = $inputElement.data('id');
			}

			if($inputElement.is('input[type="date"]')){ //text input
				var stringDate = $inputElement.val().split('-');
				data.value = stringDate[1]+'/'+stringDate[2]+'/'+stringDate[0];
				data.id = $inputElement.data('id');
			}

			if($inputElement.is('select')){ //select input
				data.value = $inputElement.val();
				data.id = $inputElement.data('id');
			}

			if($inputElement.is(':checkbox')){ //checkbox input
				var checkboxValues = '';
				$inputElement.closest('div').find(':checkbox:checked').each(function(i,elm){
					checkboxValues += $(elm).val()+'|';
				});
				data.value = checkboxValues.slice(0,-1);
				data.id = $inputElement.data('id');
			}

			//check if attributes are currently being edited, if so don't show toggle edit button
			$.ajax({
				dataType:'json',
				type:'POST',
				url:buildURL({
					'serviceClassName': 'obre_objectrelationshipService',
					'serviceMethodName': 'addOrUpdateDataObject',
					'serviceParameters': {
						type: that.objectType,
						referencepk: that.objectId,
						cact_id: inputCactId,
						dataObject:JSON.stringify(data),
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(){
				$.powerTip.hide($inputElement);
			});

		},2000,{leading:true,trailing:true}),

		resizeAttsDisabledCover:function(elm){
			//func. to either do this to one element or all elements when window resizes
			//if element is passed in that once, if nothing is passed then all elements that need resized
			this.$(elm ? elm : '.panel-collapse').each(function(i,elm){
				var $this = $(elm);
				var w = $this.find('.panel-body').innerWidth();
				var h = $this.find('.panel-body').innerHeight();
				$(this).find('.attsDisabledCover').width(w).height(h);

			});
		}

	});

});


