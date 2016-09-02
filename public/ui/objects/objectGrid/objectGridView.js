define(function(require) {
	'use strict';

	var BaseView = require('backboneBaseObjects/baseView');

	require('css!./objectGridStyle');
	require('kendoui/kendo.grid');

	var _ = require('underscore');
	var mediator = require('utilities/mediator');
	var session = require('utilities/session');
	var buildURL = require('utilities/buildApiUrl');
	var spin = require('spin');
	var Ladda = require('ladda');

	require('handlebarsHelpers/encodeUrl');
	require('handlebarsHelpers/comparison');

	var rowTemplate = require('html!./createRowTemplate');
	var objectGridTemplate = require('html!./objectGridTemplate');

	// Build the view.
	return BaseView.extend({
		initialize: function(options) {
			mediator.on('renderGridList', function(type) {
				this.render(type);
			}, this);

			var that = this;

			$(document).off('click.gridDD').on('click.gridDD', function(e) {
				that.closeDropDownMenus(e);
			});
		},

		events: {
			'click .editObject': 'editObject',
			'mouseenter tr.k-master-row': 'rowHoverEnter',
			'mouseleave tr.k-master-row': 'rowHoverExit',
			'click .object_files_media': 'filesMedia',
			'click .edit_details': 'editDetails',
			'click .object_properties': 'objectProperties',
			'click .object_comments': 'objectComments',
			'click .object_history': 'objectHistory',
			'click .object_export': 'exportObject',
			'click .linkToPersona': 'linkToPersona',
			'click .object_duplicate': 'duplicateObject',
			'click .deleteObject': 'deleteObject',
			'click .object_summary': 'objectSummary',
			'click .dropdown-toggle': 'toggleActionsMenu',
			'click .k-grid-content tr': 'rowHighlightAndOpenSubGrid'
		},

		linkToPersona: function(e) {
			var $this = $(e.target);
			var id = $this.data('object-id');
			var link = $this.attr('href');

			var parentId = this.$el.find('#grid .editObject[data-object-id="' + id + '"]')
				.closest('table')
				.closest('tr')
				.prev('tr')
				.find('a.editObject:first')
				.data('object-id');

			link = link.replace(/\|id\|/, id);
			link = link.replace(/\|parent\|/, parentId);

			window.location.href = link;

			return false;
		},

		duplicateObject: function(e) {
			var $this = $(e.target);
			var type = $this.data('type');
			var id = $this.data('object-id');

			var parentId = this.$el.find('#grid .editObject[data-object-id="' + id + '"]')
				.closest('table')
				.closest('tr')
				.prev('tr')
				.find('a.editObject:first')
				.data('object-id');

			var name = $this.data('object-name');
			name = decodeURIComponent(name).replace(/\+/g, ' ');

			mediator.trigger('showObjectDuplicateModal', type, id, parentId, name);

			return false;
		},

		editDetails: function(e) {
			var id = $(e.target).data('object-id');

			this
				.$el
				.find('#grid .editObject[data-object-id="' + id + '"]')
				.trigger('click');

			return false;
		},

		filesMedia: function(e) {
			var $this = $(e.target);
			var link = $this.attr('href');
			var id = $this.data('object-id');

			window.location.href = link.replace(/\|id\|/, id);

			return false;
		},

		objectProperties: function(e) {
			var $this = $(e.target);
			var type = $this.data('type');
			var id = $this.data('object-id');

			mediator.trigger('showObjectPropertiesModal', type, id);

			return false;
		},

		objectComments: function(e) {
			var $this = $(e.target);
			var type = $this.data('type');
			var id = $this.data('object-id');

			mediator.trigger('showObjectCommentsModal', type, id);

			return false;
		},

		objectHistory: function(e) {
			var $this = $(e.target);
			var type = $this.data('type');
			var id = $this.data('object-id');

			mediator.trigger('showObjectHistoryModal', type, id);

			return false;
		},

		exportObject: function(e) {
			var $this = $(e.target);
			var type = $this.data('type');
			var id = $this.data('object-id');

			$.ajax({
				dataType: 'json',
				type: 'GET',
				url: buildURL({
					serviceClassName: 'obre_objectrelationshipService',
					serviceMethodName: 'exportObject',
					serviceParameters: {
						type: type,
						referencePk: id,
						groupId: session.groupId,
						userId: session.userId
					}
				})
			})
			.done(function(response) {
				window.location.href = response.fileUrl;
			});

			return false;
		},

		deleteObject: function(e) {
			var that = this;
			var $this = this.$(e.target);
			var id = $this.data('object-id');
			var type = $this.data('type');

			// Grab button, start loader UI.
			var loader = Ladda.create($this.get(0));
			loader.start();

			var objectsToRemove = {
				type: type,
				id: id
			};

			$.ajax({
				dataType: 'json',
				type: 'POST',
				url: buildURL({
					'serviceClassName': 'obre_objectrelationshipService',
					'serviceMethodName': 'deleteObjects',
					'serviceParameters': {
						objectMap: JSON.stringify([objectsToRemove]),
						groupId: session.groupId,
						userId: session.userId
					}
				})
			})
			.done(function() {
				that.$el.find('#grid ~ .dropdown-menu').find('.object_delete').trigger('click').end().remove();

				var row = that.$el.find('#grid a.editObject[data-object-id="' + id + '"]').closest('tr');

				that.$el.find('#grid').data("kendoGrid").removeRow(row);
				loader.stop();
			});

			return false;
		},

		objectSummary: function(e) {
			var $this = $(e.target);
			var id = $this.data('object-id');

			var link = $this.attr('href');
			link = link.replace(/\|id\|/, id);

			var parentId = $this.closest('ul').data('parent-id');

			if (parentId && parentId !== '0') {
				link = link.replace(/\|parent\|/, parentId);
			}

			window.location.href = link;

			return false;
		},

		closeDropDownMenus: function(e) {
			var $this = $(e.target);

			// Is this a drop-down?
			var isDropDown =
				$this.closest('button').is('.dropdown-toggle') ||
				$this.closest('ul').is('.dropdown-menu') ||
				$this.parents('.modal').length === 1;

			// Take no action, if inside a drop-down.
			if (isDropDown) {
				return;
			}

			$('.dropdown-menu:visible').each(function() {
				var id = $(this).attr('data-dd-id');
				var button = $('button[data-dd-id="'+id+'"]');
				button.trigger('click');
			});
		},

		toggleActionsMenu: function(e) {
			var $this = this.$(e.target).closest('button');

			var parentId = $this
				.closest('table')
				.closest('tr')
				.prev('tr')
				.find('a.editObject:first')
				.data('object-id');

			if ($this.data('dd-id') === this.$el.find('#grid ~ .dropdown-menu').data('dd-id')) {
				this.$el.find('#grid ~ .dropdown-menu').remove();
				return;
			}

			this.$el.find('#grid ~ .dropdown-menu').remove();

			this.$el.append($this.next('ul').clone());

			var currentDropDown = this.$el.find('#grid ~ .dropdown-menu');

			var parentOfDropdownPos = this.$el.offset();

			var buttonPos = $this.offset();

			currentDropDown
			.css({
				top: buttonPos.top - parentOfDropdownPos.top + 39,
				right: $(window).width() - buttonPos.left - 99
			})
			.data('parent-id', parentId)
			.show();

			// Setup delete for actions menu.
			currentDropDown
			.find('.object_delete')
			.click(function(e) {
				e.preventDefault();
			})
			.popover({
				placement: 'left',
				html: 'true',
				title: 'Delete, are you sure?'
			})
			.on('hide.bs.popover', $.proxy(function(e) {
				var $this = this.$(e.target);
				$this.text('Delete Object');
			}, this))
			.on('show.bs.popover', $.proxy(function(e) {
				var $this = this.$(e.target);
				$this.text('cancel');
			}, this));
		},

		rowHoverEnter: function(e) {
			$(e.target).closest('tr').addClass('k-state-hover');
			return false;
		},

		rowHoverExit: function(e) {
			$(e.target).closest('tr').removeClass('k-state-hover');
			return false;
		},

		rowHighlightAndOpenSubGrid: function(e) {
			var $this = this.$(e.target);

			if ($this.closest('td').is('.k-hierarchy-cell')) {
				return;
			}

			if ($this.closest('td').is('.k-detail-cell')) {
				return;
			}

			if ($this.closest('div').is('.k-grid-pager')) {
				return;
			}

			if ($this.closest('a').is('.btn') || $this.closest('button').is('.btn')) {
				return;
			}

			if (!$this.is('a.k-icon.k-minus') || !$this.closest('a').is('.btn') || !$this.closest('button').is('.btn')) {
				$this.closest('tr').find('.k-hierarchy-cell a').trigger('click');
			}

			this.$el.find('.k-grid-content .k-state-selected').not('span').removeClass('k-state-selected');

			if ($this.closest('tr').is('.k-state-selected')) {
				$this.closest('tr').removeClass('k-state-selected');
			}
			else {
				$this.closest('tr').addClass('k-state-selected');
			}

			// Close drop-down menus that may be open.
			this.closeDropDownMenus(e);

			// Prevent bubbling to higher <tr>.
			return false;
		},

		render: function(type, object) {
			// Don't render if object is null or type is null.
			if (object || type === null) {
				return this;
			}

			// Remove old grid row action menus.
			this.$el.find('.dropdown-menu').remove();

			var that = this;

			// Remove grid if one is already in the view region.
			var grid = that.$el.find('#grid');
			var gridLoader = that.$el.find('#gridLoader');

			if (grid.data('kendoGrid')) {
				grid.data('kendoGrid').destroy();
				grid.empty();
				grid[0].className = '';
			}

			if (that.$('#gridHeader').length) {
				that.$('#gridHeader').remove();
			}

			new spin(that.spinnerOpts).spin(gridLoader[0]);

			$.ajax({
				dataType: 'json',
				type: 'GET',
				url: buildURL({
					serviceClassName: 'obre_objectrelationshipService',
					serviceMethodName: 'findAllObjectsByType',
					serviceParameters: {
						type: type,
						groupId: session.groupId,
						userId: session.userId
					}
				})
			})
			.done(function(response) {
				that.$el.prepend(objectGridTemplate({
					gridTitle: response.typeTitle,
					result: response.result.length
				}));

				if (response.result.length === 0) {
					// Do it once.
					gridLoader.empty();
					return false;
				}

				// Columns using only child and parent.
				that.fieldsParent = response['Fields Parent'];

				// Could be undefined, then parent is used.
				that.fieldsChild = response['Fields Child'];

				// Fixed width for edit and actions columns, updating JSON with width.
				that.fieldsParent[that.fieldsParent.length - 1].width = 74;
				that.fieldsParent[that.fieldsParent.length - 2].width = 52;

				if (that.fieldsChild) {
					that.fieldsChild[that.fieldsChild.length - 1].width = 74;
					that.fieldsChild[that.fieldsChild.length - 2].width = 52;
				}

				// Used on every grid to remove drop-down. If no sub grid is
				// found, also will remove column menu on edit and actions.
				var removeRowsWithNoChildGridsAndColumnMenu = function() {
					that.$el.find('#grid ~ .dropdown-menu').remove();

					var dataSource = this.dataSource;

					this
					.element
					.find('tr.k-master-row')
					.each(function() {
						var row = $(this);
						var data = dataSource.getByUid(row.data('uid'));

						// This example will work if Objects is
						// null or 0 (if the row has no details).
						if (!data.get('Objects')) {
							row.find('.k-hierarchy-cell a').remove();
						}
					});

					this
					.element
					.find('thead th[data-title="Edit"],thead th[data-title="Actions"]')
					.each(function() {
						$(this).find('.k-header-column-menu').remove();
						$(this).removeClass('k-with-icon');
					});
				};

				var highlightRowIfClickingOnArrrowBtn = function(e) {
					that
					.$el
					.find('#grid ~ .dropdown-menu')
					.remove();

					that
					.$el
					.find('.k-grid-content .k-state-selected')
					.not('span')
					.removeClass('k-state-selected');

					if (e.masterRow.is('.k-state-selected')) {
						e.masterRow.removeClass('k-state-selected');
					}
					else {
						e.masterRow.addClass('k-state-selected');
					}
				};

				// Top grid configs.
				var parentGridConfigs = {
					columns: that.fieldsParent,
					scrollable: true,
					filterable: true,
					columnMenu: {
						filterable: true,
						sortable: true
					},
					sortable: true,
					resizable: true,
					pageable: {
						pageSizes: [5, 10, 25, 50, 75, 100],
						pageSize: 25
					},
					reorderable: true,
					selectable: 'row',
					detailExpand: highlightRowIfClickingOnArrrowBtn,
					detailCollapse: highlightRowIfClickingOnArrrowBtn,
					dataSource: response.result,
					dataBound: removeRowsWithNoChildGridsAndColumnMenu
				};

				// Child grid configs.
				var childGridConfigs = {
					columns: (that.fieldsChild || that.fieldsParent),
					scrollable: false,
					filterable: true,
					columnMenu: {
						filterable: true,
						sortable: true
					},
					pageable: {
						pageSizes: [5, 10, 25, 50, 75, 100],
						pageSize: 25
					},
					reorderable: true,
					sortable: true,
					selectable: 'row',
					resizable: true,
					detailExpand: highlightRowIfClickingOnArrrowBtn,
					detailCollapse: highlightRowIfClickingOnArrrowBtn,
					dataBound: removeRowsWithNoChildGridsAndColumnMenu
				};

				//==================
				// Start first grid.
				//==================

				// If no Objects properties are found in data set, then no child grids at all.
				var childGridsFound = _.findKey(response.result, 'Objects') !== undefined;

				// If no child grids in data, don't show sub grid column button.

				// If true, then add arrow and expect child table.
				if (childGridsFound) {
					// Will add sub grid <tr>.
					parentGridConfigs.detailTemplate = '';
				}

				// Create parent row template, using Handlebars outputting a Kendo UI template.
				parentGridConfigs.rowTemplate = rowTemplate({
					data: that.fieldsParent,
					hasChildGrid: childGridsFound,
					type: type
				});

				// Do it once.
				gridLoader.empty();

				// Create first grid.
				var pGridRef = that.$el.find('#grid').kendoGrid(parentGridConfigs);

				// Hide pager if less than 25.
				if (pGridRef.data('kendoGrid').dataSource.total() < 26) {
					that.$el.find('#grid').data('kendoGrid').pager.element.hide();
				}

				// Exit if no second depth grids are in object,
				// because no `detailInit` event is bound on grid.
				if (!childGridsFound) {
					return;
				}

				//===================
				// Start second grid.
				//===================

				// Get ref to first data grid.
				var parentGrid = that.$el.find('#grid').data('kendoGrid');

				parentGrid.bind('detailInit', function(e) { //in scoped of row now
					// Get Objects data for grid.
					var gridData = e.data.get('Objects');

					// Get default options for child grids.
					var gridOptions = _.clone(childGridConfigs, true);

					var childGridsFound = _.findKey(gridData, 'Objects') !== undefined;

					// If no child grids in data, don't show sub grid column button.

					// If true, then add arrow and expect child table.
					if (childGridsFound) {
						// Will add sub grid <tr>.
						gridOptions.detailTemplate = '';
					}

					// If a child set of columns was sent, use it to create row
					// template. Otherwise, use parent columns to create sub grids.
					if (that.fieldsChild) {
						gridOptions.rowTemplate = rowTemplate({
							data: that.fieldsChild,
							hasChildGrid: childGridsFound,
							type: type
						});
					}
					else {
						gridOptions.rowTemplate = rowTemplate({
							data: that.fieldsParent,
							hasChildGrid: childGridsFound,
							type: type
						});
					}

					// Add data to child grid config.
					gridOptions.dataSource = e.data.get('Objects');

					// Create child grid, append to detail cell (child row).
					$('<div/>').appendTo(e.detailCell).kendoGrid(gridOptions);

					// Set child pager size (broken for some reason) and hide if less than 25.
					var cGridRef = $(e.detailCell).find('div:first').data('kendoGrid');

					cGridRef.dataSource.pageSize(25);

					if (cGridRef.dataSource.total() < 26) {
						cGridRef.pager.element.hide();
					}

					if (!childGridsFound) {
						return;
					}

					//==================
					// Start third grid.
					//==================

					// Grab child grid.
					var childGrid = e.detailCell.find('.k-grid:first').data('kendoGrid');

					childGrid.bind('detailInit', function(e) {
						// Get Objects data for grid.
						var gridData = e.data.get('Objects');

						// Get default options for child grids.
						var gridOptions = _.clone(childGridConfigs, true);
						var childGridsFound = _.findKey(gridData, 'Objects') !== undefined;

						// If data for grid contains no child grids don't create sub row.
						if (childGridsFound) {
							gridOptions.detailTemplate = '';
						}

						// If a child set of columns was sent, use it to create row
						// template. Otherwise, use parent columns to create sub grids.
						if (that.fieldsChild) {
							gridOptions.rowTemplate = rowTemplate({
								data: that.fieldsChild,
								hasChildGrid: childGridsFound,
								type: type
							});
						} else {
							gridOptions.rowTemplate = rowTemplate({
								data: that.fieldsParent,
								hasChildGrid: childGridsFound,
								type: type
							});
						}

						// Add data to child grid config.
						gridOptions.dataSource = e.data.get('Objects');

						// Create child grid, append to detail cell (child row).
						$('<div></div>').appendTo(e.detailCell).kendoGrid(gridOptions);

						// Set child pager size (broken for some reason) and hide if less than 25.
						var cGridRef = $(e.detailCell).find('div:first').data('kendoGrid');

						cGridRef.dataSource.pageSize(25);

						if (cGridRef.dataSource.total() < 26) {
							cGridRef.pager.element.hide();
						}

						if (!childGridsFound) {
							return;
						}

						//===================
						// Start fourth grid.
						//===================

						// Grab child grid
						var childGrid = e.detailCell.find('.k-grid:first').data('kendoGrid');

						childGrid.bind('detailInit', function(e) {
							// Get Objects data for grid.
							var gridData = e.data.get('Objects');

							// Get default options for child grids.
							var gridOptions = _.clone(childGridConfigs, true);
							var childGridsFound = _.findKey(gridData, 'Objects') !== undefined;

							// If data for grid contains no child grids don't create sub row.
							if (childGridsFound) {
								gridOptions.detailTemplate = '';
							}

							// If a child set of columns was sent, use it to create
							// row template. Otherwise, use parent columns to create sub grids.
							if (that.fieldsChild) {
								gridOptions.rowTemplate = rowTemplate({
									data: that.fieldsChild,
									hasChildGrid: childGridsFound,
									type: type
								});
							}
							else {
								gridOptions.rowTemplate = rowTemplate({
									data: that.fieldsParent,
									hasChildGrid: childGridsFound,
									type: type
								});
							}

							// Add data to child grid config.
							gridOptions.dataSource = e.data.get('Objects');

							// Create child grid, append to detail cell i.e. child row
							$('<div/>').appendTo(e.detailCell).kendoGrid(gridOptions);

							// Set child pager size (broken for some reason) and hide if less than 25.

							var cGridRef = $(e.detailCell).find('div:first').data('kendoGrid');

							cGridRef.dataSource.pageSize(25);

							if (cGridRef.dataSource.total() < 26) {
								cGridRef.pager.element.hide();
							}

							if (!childGridsFound) {
								return;
							}

							//==================
							// Start fifth grid.
							//==================

							// Grab child grid
							var childGrid = e.detailCell.find('.k-grid:first').data('kendoGrid');

							childGrid.bind('detailInit', function(e) {
								// Get Objects data for grid.
								var gridData = e.data.get('Objects');

								// Get default options for child grids.
								var gridOptions = _.clone(childGridConfigs, true);
								var childGridsFound = _.findKey(gridData, 'Objects') !== undefined;

								// If data for grid contains no child grids don't create sub row.
								if (childGridsFound) {
									gridOptions.detailTemplate = '';
								}

								// If a child set of columns was sent, use it to create
								// row template. Otherwise, use parent columns to create sub grids.
								if (that.fieldsChild) {
									gridOptions.rowTemplate = rowTemplate({
										data: that.fieldsChild,
										hasChildGrid: childGridsFound,
										type: type
									});
								}
								else {
									gridOptions.rowTemplate = rowTemplate({
										data: that.fieldsParent,
										hasChildGrid: childGridsFound,
										type: type
									});
								}

								// Add data to child grid config.
								gridOptions.dataSource = e.data.get('Objects');

								// Create child grid, append to detail cell (child row).
								$('<div/>').appendTo(e.detailCell).kendoGrid(gridOptions);

								// Set child pager size (broken for some reason) and hide if less than 25.

								var cGridRef = $(e.detailCell).find('div:first').data('kendoGrid');

								cGridRef.dataSource.pageSize(25);

								if (cGridRef.dataSource.total() < 26) {
									cGridRef.pager.element.hide();
								}

							// END: Fifth level grid.
							});

						// END: Fourth level grid.
						});

					// END: Third level grid.
					});

				// END: Second level grid.
				});

			// END: Ajax `done`.
			});

		// END: render.
		},

		spinnerOpts: {
			lines: 17, // The number of lines to draw.
			length: 4, // The length of each line.
			width: 2, // The line thickness.
			radius: 8, // The radius of the inner circle.
			corners: 0, // Corner roundness (0..1).
			rotate: 37, // The rotation offset.
			direction: 1, // 1: clockwise, -1: counterclockwise.
			color: '#333', // #rgb or #rrggbb or array of colors.
			speed: 1.8, // Rounds per second.
			trail: 10, // Afterglow percentage.
			hwaccel: false, // Whether to use hardware acceleration.
			className: 'spinner', // The CSS class to assign to the spinner.
			zIndex: 2e9, // The z-index (defaults to 2000000000).
			top: 'auto', // Top position relative to parent in px.
			left: 'auto' // Left position relative to parent in px.
		},

		editObject: function(e) {
			// Get data from edit button.
			var $this = this.$(e.target).closest('a');
			var type = $this.data('type');
			var objectName = $this.data('object-name');
			var objectId = $this.data('object-id');

			// Remove views.
			this.$el.find('.page-header').remove().end().find('#grid').empty()[0].className = "";
			this.$el.find('.dropdown-menu').remove();
			mediator.trigger('removeCreateObjectBtn');

			// Update URL, but don't run any routes.
			ux360.router.navigate('objects/' + type + '/' + decodeURIComponent(objectName) + '/' + objectId);

			// Add views.
			mediator.trigger('renderObjectAttsLock', type, objectName, objectId);
			mediator.trigger('renderObjectAtts', type, objectName, objectId);
			mediator.trigger('renderObjectAssociations', type, objectName, objectId);

			// Prevent bubbling.
			return false;
		}

	// END: return.
	});

// END: define.
});