define(function (require) {

	'use strict';

	var mediator = require('utilities/mediator');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');
	var Ladda = require('ladda');
	require('vgrid');
	require('imagesloaded');
	var $ = require('jquery');
	var _ = require('underscore');
	var objectTypeScope;
	var objectIdScope;

	//inherits from:
	var BaseView = require('backboneBaseObjects/baseView');

	//view template
	var objectAttsStockPhotosModalTemplate = require('html!./objectAttsStockPhotoModalTemplate');

	//view css
	require('css!./objectAttsStockPhotoModalViewStyle');

	//shared variable in methods below
	var $stockPhotoButtonNodeElement;

	return BaseView.extend({

		initialize: function(options){
			mediator.on('showStockPhotosModal', function(objectType,objectId,elm){
				this.render(objectType,objectId,elm);
			}, this);
		},

		events:{
			'click .stockPhoto':'selectAndUpdatePhoto'//click on an image and do something''
		},

		render:function(type,objectId,stockPhotoButtonNodeElement){ //passing in the btn (node) that was clicked

			if(!_.all([type,objectId])){return this;}

			//from func. scope
			objectTypeScope = type;
			objectIdScope = objectId;

			var stockPhotoBtn = Ladda.create(stockPhotoButtonNodeElement);
			stockPhotoBtn.start();

			$stockPhotoButtonNodeElement = $(stockPhotoButtonNodeElement);
			var catId = $stockPhotoButtonNodeElement.closest('.attsImage').data('cact-id');
			var recordId = $stockPhotoButtonNodeElement.data('id');

			var that = this;

			$.ajax({
				dataType:'json',
				type:'POST',
				url:buildURL({
					'serviceClassName': 'uxme_mediaService',
					'serviceMethodName': 'getAllImagesFromPMLibrary',
					'serviceParameters': {
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(response){ //get stock photos

				//load images in modal
				that.$el.html(objectAttsStockPhotosModalTemplate({
					photos:response,
					catId:catId,
					recordId:recordId
				}));

				that.$('#stockPhotosContainer')
					.imagesLoaded() //wait for images to be loaded
					.done(function(){ //images are done loading

						that.$el.on('shown.bs.modal',function(){ //invoke when modal is opened

							that.$("#stockPhotosContainer").vgrid({ //use a grid layout tool
								easing: "easeOutQuint",
								fadeIn: {
									time: 200,
									delay: 50
								}
							});

							//stop loader on button, so cancel does not have too
							stockPhotoBtn.stop();

						});

						//open modal, which call the shown.bs.modal event above.
						that.openModal();

					});
			});

		},

		selectAndUpdatePhoto:function(e){ //image is clicked, and selected, so send change

			var that = this;

			var $this = this.$(e.target);
			var data = {id:$this.data('record'),value:$this.data('img-id')};
			
			$.ajax({
				dataType:'json',
				type:'POST',
				url:buildURL({
					'serviceClassName': 'obre_objectrelationshipService',
					'serviceMethodName': 'addOrUpdateDataObject',
					'serviceParameters': {
						type: objectTypeScope,
						referencepk: objectIdScope,
						cact_id: $this.data('cat-id'),
						dataObject:JSON.stringify(data),
						groupId: session.groupId,
						userId: session.userId
					}
				})
			}).done(function(){

				//reset buttons & update image
				$stockPhotoButtonNodeElement
					.text('stock image')
					.closest('.attsImage').find('img').attr('src',$this.attr('src'))
					.end()
					.find('.deletePhoto')
					.show();

				that.closeModal();
			});

			return false;
		},

		//set the size of the modal based on current view port size
		openModal:function(){
			this.$el.modal({
				width:($(window).width() - 165),
				height:($(window).height() - 265)
			});
		},
		//close window, but don't destroy it
		closeModal:function(){
			this.$el.modal('hide');
		}

	});

});


