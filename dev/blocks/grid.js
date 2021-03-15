

const _gridTexture = [
	["disk_drive_bottom", 0], // bottom
	["grid_top", 0], // top
	["grid_back", 0], // back
	["grid_front", 0], // front
	["grid_left", 0], // left
	["grid_right", 0]  // right
];

function getGridTexture(variation, _active){
	variation = variation || 0;
	var i = _active ? 1 : 0;
	return [[_gridTexture[0], [_gridTexture[1][0], 0], _gridTexture[2], [_gridTexture[3][0], i], _gridTexture[4], _gridTexture[5]], [_gridTexture[0], [_gridTexture[1][0], 1], [_gridTexture[3][0], i], _gridTexture[2], _gridTexture[5], _gridTexture[4]], [_gridTexture[0], [_gridTexture[1][0], 2], _gridTexture[5], _gridTexture[4], _gridTexture[2], [_gridTexture[3][0], i]], [_gridTexture[0], [_gridTexture[1][0], 3], _gridTexture[4], _gridTexture[5], [_gridTexture[3][0], i], _gridTexture[2]]][variation];
}

IDRegistry.genBlockID("RS_grid");
Block.createBlockWithRotation("RS_grid", [
	{
		name: "Grid",
		texture: getGridTexture(),
		inCreative: true
	}
]);
mod_tip(BlockID['RS_grid']);
RS_blocks.push(BlockID['RS_grid']);
EnergyUse[BlockID['RS_grid']] = Config.energy_uses.grid;

for (var izxc = 0; izxc < 4; izxc++) {
	var render = new ICRender.Model();
	var model = BlockRenderer.createTexturedBlock(getGridTexture(izxc));
	render.addEntry(model);
	BlockRenderer.enableCoordMapping(BlockID["RS_grid"], izxc, render);
}

var filter_size_map = [24, 36, 32];//6,9,8  *4

var gridData = {
	maxY: 0,
	lastPage: -1,
	textSearch: false,
	lowPriority: false,
	slotsKeys: [],
	updateGui: function(){}
}

function gridSwitchPage(page, container, ignore, dontMoveSlider){
	if(Config.dev)Logger.Log('Switch grid Page; page: ' + page + ' ; ignore: ' + ignore + ' ; dontMoveSlider: ' + dontMoveSlider + ' ; container: ' + container, 'RefinedStorageDebug');
	if(!container.getUiAdapter() || !container.getUiAdapter().getWindow() || !container.getUiAdapter().getWindow().isOpened()) return false;
	var slots = container.slots;
	var slotsKeys = gridData.slotsKeys;
	var slots_count = gridData.slots_count;
	var x_count = gridData.x_count;
	var pages1 = gridFuncs.getPages(slotsKeys.length);
	var pages = Math.max(1, pages1 + 1 - gridData.y_count);
	page = Math.max(1, Math.min(page, pages)) - 1;
	if(page == gridData.lastPage - 1 && !ignore) return false;
	gridData.lastPage = page + 1;
	var pages = gridFuncs.getPages(slotsKeys.length);
	var ___y = gridFuncs.getCoordsFromPage(page + 1, pages);
	if(!dontMoveSlider)container.getUiAdapter().getElement("slider_button").setPosition(_elementsGUI_grid['slider_button'].x, ___y);
	if (!gridData.isWorkAllowed) {
		for (var i = 0; i < slots_count; i++) {
			container.setSlot("slot" + i, 0, 0, 0, null);
			container.setText("slot" + i, "0");
		}
		return false;
	}
	var elements_ = container.getUiAdapter().getWindow().getWindow('main').getElements();
	for (var i = page * x_count; i < page * x_count + slots_count; i++) {
		var a = i - (page * x_count);
		var item = slots[slotsKeys[i]] || { id: 0, data: 0, count: 0, extra: null };
		//container.markSlotDirty("slot" + a);
		container.markSlotDirty("slot" + a);
		elements_.get("slot" + a).setBinding('text', cutNumber(item.count, true) + "");
		//container.setText("slot" + a, cutNumber(item.count));
		container.setSlot("slot" + a, item.id, item.count, item.data, item.extra || null);
	}
	return true;
}
var _gridSwitchPage__ = gridSwitchPage;

function grid_set_elements(x, y, cons, limit, elementsGUI_grid, grid_Data, _window, __gridSwitchPage) {
	var gridSwitchPage = __gridSwitchPage || _gridSwitchPage__;
	var gridData = grid_Data || {
		maxY: 0,
		lastPage: -1,
		textSearch: false,
		updateGui: function(){}
	};
	var moving = false;
	var max_y = 0;
	var swipe_y;
	var swipe_sum = 0;
	elementsGUI_grid.clickFrameTouchEvents = [];
	elementsGUI_grid["click_frame"] = {
		type: "frame",
		x: -100,
		y: -100,
		z: -100,
		width: 1200,
		height: 1200,
		bitmap: "empty",
		scale: 1,
		onTouchEvent: function (element, event) {
			for(var i in elementsGUI_grid.clickFrameTouchEvents){
				elementsGUI_grid.clickFrameTouchEvents[i](element, event);
			}
		}
	};
	var headerWindow = _window.getWindow('header');
	var headerElements = headerWindow.getContent().elements;
	headerElements['itemInfoFrame'] = {
        type: "frame",
        x: 100,
        y: 15,
        width: 300,
        height: 50,
        bitmap: "itemInfoFrame",
        scale: 2
	}
	headerElements['itemInfoSlot'] = {
        type: "slot",
        x: headerElements['itemInfoFrame'].x + 5,
		y: headerElements['itemInfoFrame'].y + 5,
		z: 100,
		size: 40,
		bitmap: "_default_slot_empty",
		isTransparentBackground: true,
		visual: true
	}
	headerElements['itemInfoName'] = {
		type: "text",
		x: headerElements['itemInfoSlot'].x + headerElements['itemInfoSlot'].size + 3,
		y: headerElements['itemInfoSlot'].y + 1,
		z: 100,
		text: "",
		font: {
			color: android.graphics.Color.WHITE,
			shadow: 0,
			size: 11
		}
	}
	headerElements['itemInfoDescription'] = {
		type: "text",
		x: headerElements['itemInfoSlot'].x + headerElements['itemInfoSlot'].size + 3,
		y: headerElements['itemInfoName'].y + Math.round(headerElements['itemInfoName'].font.size*1.1) + 2,
		z: 100,
		text: "",
		multiline: true,
		font: {
			color: android.graphics.Color.GRAY,
			shadow: 0,
			size: 9
		}
	}
	var _font = new JavaFONT(headerElements['itemInfoName'].font);
	var _font2 = new JavaFONT(headerElements['itemInfoDescription'].font);
	function setItemInfoSlot(_item, container){
		gridData.selectedItemInfoSlot = _item;
		var item = container.getSlot(_item);
		container.setSlot('itemInfoSlot', item.id, 1, item.data, item.extra);
		var fullName = Item.getName(item.id, item.data, item.extra).replace(/§./g, '');
		var splitedName = fullName.split('\n');
		//if(splitedName[0][0] == '§') headerElements['itemInfoName'].font.color = parseMineColor(splitedName[0][1]);
		var text = (splitedName[0].length > 40 ? splitedName[0].substr(0, 40) + '...' : splitedName[0]) + ' (' + numberWithCommas(item.count) + ')';
		if(Config.dev)splitedName.push('id: ' + item.id + '  data: ' + item.data);
		container.setText('itemInfoName', text);
		container.setText('itemInfoDescription', splitedName.slice(1).join('\n'));
		var frameWidth = 0;
		var drawScale = headerWindow.location.getDrawingScale();
		var nameWidth = _font.getBounds(text, headerElements['itemInfoName'].x * drawScale, headerElements['itemInfoName'].y * drawScale, parseFloat(1.0)).width();
		frameWidth = nameWidth;
		var newSplitedName = splitedName.slice(1);
		for(var i in newSplitedName){
			var descrWidth = _font2.getBounds(newSplitedName[i], headerElements['itemInfoDescription'].x * drawScale, headerElements['itemInfoDescription'].y * drawScale, parseFloat(1.0)).width();
			if(descrWidth > frameWidth) frameWidth = descrWidth;
		}
		//alert(headerElements['itemInfoName'].x + " + " + frameWidth + " + " + 5 + " = " + (headerElements['itemInfoName'].x + frameWidth + 5));
		headerElements['itemInfoFrame'].width = 50 + frameWidth + 10;
		headerWindow.forceRefresh();
	}
	gridData.setItemInfoSlot = setItemInfoSlot;
	elementsGUI_grid.clickFrameTouchEvents.push(function (element, event) {
		var content = {elements:elementsGUI_grid};/* element.window.getContent(); *///getContainer().getGuiContent();
		var itemContainerUiHandler = element.window.getContainer();
		var itemContainer = itemContainerUiHandler.getParent();
		if (event.type == "DOWN" && !swipe_y && event.x > elementsGUI_grid["x_start"] && event.x < elementsGUI_grid["x_end"] && event.y > elementsGUI_grid["y_start"] && event.y < elementsGUI_grid["y_end"]) {
			swipe_y = event.y;
		} else if (swipe_y && event.type == "MOVE") {
			var distance = Math.abs(event.y - swipe_y);
			function moveSwitchPage_(_n){
				_n = (_n ? 1 : -1);
				gridSwitchPage(gridData.lastPage + _n, itemContainer);
			}
			if (distance > 7) {
				if (event.y > swipe_y) moveSwitchPage_(false);
				if (event.y < swipe_y) moveSwitchPage_(true);
				swipe_sum = 0;
			} else {
				swipe_sum += distance;
				if (swipe_sum > 15) {
					if (event.y > swipe_y) moveSwitchPage_(false);
					if (event.y < swipe_y) moveSwitchPage_(true);
					swipe_sum = 0;
				}
			}
			swipe_y = event.y;
		} else if (swipe_y && (event.type == "UP" || event.type == "CLICK")) {
			swipe_y = false;
		}
		if (!moving) return;
		event.y -= content.elements["slider_button"].scale * 15 / 2;
		if (event.type != 'UP' && event.type != "CLICK") {
			var page = gridFuncs.getPageFromCoords(event, gridFuncs.getPages(gridData.slotsKeys.length));
			itemContainerUiHandler.getElement("slider_button").setPosition(content.elements['slider_button'].x, Math.max(Math.min(event.y, max_y), content.elements["slider_button"].start_y));
			gridSwitchPage(page, itemContainer, false, true);
		}
		if (event.type == "UP" || event.type == "CLICK") {
			moving = false;
			var pages = gridFuncs.getPages(gridData.slotsKeys.length);
			var page = gridFuncs.getPageFromCoords(event, pages);
			gridSwitchPage(page, itemContainer);
		}
	})

	var x_count = Math.round((910 - x) / cons);
	var y_count = limit || Math.round((UI.getScreenHeight()- 60 - y - cons) / cons);

	elementsGUI_grid["search_frame"] = {
		type: "frame",
		x: x,
		y: 30,
		width: x_count*cons,
		height: 30,
		bitmap: "search_bar",
		scale: 0.8,
		clicker: {
			onClick: function (itemContainerUiHandler, itemContainer, element) {
				UI.getContext().runOnUiThread(new java.lang.Runnable({// I take this from Recipe Viewer https://icmods.mineprogramming.org/mod?id=455 :D
					run: function () {
						try {
							var editText = new android.widget.EditText(UI.getContext());
							//editText.setHint(Translation.translate("Type here item name"));
							new android.app.AlertDialog.Builder(UI.getContext())
								.setTitle(Translation.translate("Please type the keywords"))
								.setView(editText)
								.setPositiveButton(Translation.translate("Search"), {
									onClick: function () {
										if (!itemContainerUiHandler.getWindow().isOpened()) return;
										var keyword = editText.getText() + "";
										gridData.textSearch = keyword.length ? keyword : false;
										gridData.updateGui(true, true, gridData.isCrafting);
									}
								}).show();
							//UI.getContext().getActionBar().hide();
						} catch (e) {
							alert(e);
						}
					}
				}));
			}
		}
	}

	elementsGUI_grid["search_text"] = {
		type: "text",
		x: x + 10,
		y: 30 + 1,
		z: 100,
		text: Translation.translate('Search'),
		font: {
			color: android.graphics.Color.WHITE,
			shadow: 0.5,
			size: 20
		}
	}

	var asd = 0;
	var _y = y;
	var _x = x;
	for (var i = 0; i < y_count; i++) {
		_x = x;
		for (var k = 0; k < x_count; k++) {
			elementsGUI_grid['slot' + asd] = {
				type: "slot",
				num: asd,
				x: _x,
				y: _y,
				visual: true,
				onTouchEvent: function(element, event){
					var itemContainerUiHandler = element.window.getContainer();
					var itemContainer = itemContainerUiHandler.getParent();
					var _num = this.num + (gridData.lastPage - 1) * x_count;
					var slot = gridData.slotsKeys[_num];
					if(!slot)return;
					setItemInfoSlot(slot, itemContainer);
				},
				clicker: {
					onClick: function (itemContainerUiHandler, itemContainer, element) {
						var itemContainer = itemContainer.slots ? itemContainer : element;
						if (!gridData.isWorkAllowed) return;
						var _num = this.num + (gridData.lastPage - 1) * x_count;
						var slot = gridData.slotsKeys[_num];
						var slotItem = itemContainer.slots[slot];
						if(!slotItem || slotItem.id == 0) return;
						var _count = 1;
						var updateFull = false;
						if(Config.dev)Logger.Log('Deleting slot: ' + slot + ' ; num: ' + this.num + '(' + _num + ') ; lastPage: ' + gridData.lastPage + ' ; count: ' + _count + ' ; x_count: ' + x_count, 'RefinedStorageDebug');
						var elements_ = itemContainer.getUiAdapter().getWindow().getWindow('main').getElements();
						if(slotItem.count == _count) {
							itemContainer.setSlot(slot, 0, 0, 0);
							gridData.slotsKeys.splice(_num, 1);
							updateFull = true;
							gridData.updateGui(true, true);
						} else {
							if(gridData.sort == 0){
								if(_num > 0 && slotItem.count - _count <= itemContainer.slots[gridData.slotsKeys[_num - 1]].count){
									itemContainer.setSlot(slot, slotItem.id, slotItem.count - _count, slotItem.data, slotItem.extra);
									updateFull = true;
									gridData.updateGui(true, true);
								} else {
									itemContainer.markSlotDirty('slot' + this.num);
									elements_.get('slot' + this.num).setBinding('text', cutNumber(slotItem.count - _count, true) + "");
									itemContainer.setSlot('slot' + this.num, slotItem.id, slotItem.count - _count, slotItem.data, slotItem.extra);
									//itemContainer.setText('slot' + this.num, cutNumber(slotItem.count - _count));
									itemContainer.setSlot(slot, slotItem.id, slotItem.count - _count, slotItem.data, slotItem.extra);
								}
							} else {
								itemContainer.markSlotDirty('slot' + this.num);
								elements_.get('slot' + this.num).setBinding('text', cutNumber(slotItem.count - _count, true) + "");
								itemContainer.setSlot('slot' + this.num, slotItem.id, slotItem.count - _count, slotItem.data, slotItem.extra);
								//itemContainer.setText('slot' + this.num, cutNumber(slotItem.count - _count));
								itemContainer.setSlot(slot, slotItem.id, slotItem.count - _count, slotItem.data, slotItem.extra);
							}
						}
						setItemInfoSlot(slot, itemContainer);
						var map = (asdgfasdasddsad = gridData.networkData.getString('deleteItemsMap', 'null')) != 'null' ? JSON.parse(asdgfasdasddsad) : [];
						if(map.indexOf(slot) == -1){
							map.push(slot);
							gridData.networkData.putString('deleteItemsMap', JSON.stringify(map));
						}
						gridData.lowPriority = true;
						var currentCount = gridData.networkData.getInt(slot, 0);
						gridData.networkData.putInt(slot, currentCount + _count);
						gridData.networkData.putBoolean('update', true);
						gridData.networkData.putBoolean('updateFull'+slot, updateFull);
					},
					onLongClick: function (itemContainerUiHandler, itemContainer, element) {
						var itemContainer = itemContainer.slots ? itemContainer : element;
						if (!gridData.isWorkAllowed) return;
						var _num = this.num + (gridData.lastPage - 1) * x_count;
						var slot = gridData.slotsKeys[_num];
						var slotItem = itemContainer.slots[slot];
						if(!slotItem || slotItem.id == 0) return;
						var maxStack = Item.getMaxStack(slotItem.id);
						var this_item = searchItem(slotItem.id, slotItem.data, false, true);
						var _count = this_item && this_item.count < maxStack && this_item.extra == slotItem.extra ? Math.min(slotItem.count, maxStack - this_item.count) : Math.min(slotItem.count, maxStack);
						var updateFull = false;
						if(Config.dev)Logger.Log('Deleting slot: ' + slot + ' ; num: ' + this.num + '(' + _num + ') ; lastPage: ' + gridData.lastPage + ' ; count: ' + _count + ' ; x_count: ' + x_count, 'RefinedStorageDebug');
						var elements_ = itemContainer.getUiAdapter().getWindow().getWindow('main').getElements();
						if(slotItem.count <= _count) {
							itemContainer.setSlot(slot, 0, 0, 0);
							gridData.slotsKeys.splice(_num, 1);
							updateFull = true;
							gridData.updateGui(true, true);
						} else {
							if(gridData.sort == 0){
								if(_num > 0 && slotItem.count - _count <= itemContainer.slots[gridData.slotsKeys[_num - 1]].count){
									itemContainer.setSlot(slot, slotItem.id, slotItem.count - _count, slotItem.data, slotItem.extra);
									updateFull = true;
									gridData.updateGui(true, true);
								} else {
									itemContainer.markSlotDirty('slot' + this.num);
									elements_.get('slot' + this.num).setBinding('text', cutNumber(slotItem.count - _count, true) + "");
									itemContainer.setSlot('slot' + this.num, slotItem.id, slotItem.count - _count, slotItem.data, slotItem.extra);
									//itemContainer.setText('slot' + this.num, cutNumber(slotItem.count - _count));
									itemContainer.setSlot(slot, slotItem.id, slotItem.count - _count, slotItem.data, slotItem.extra);
								}
							} else {
								itemContainer.markSlotDirty('slot' + this.num);
								elements_.get('slot' + this.num).setBinding('text', cutNumber(slotItem.count - _count, true) + "");
								itemContainer.setSlot('slot' + this.num, slotItem.id, slotItem.count - _count, slotItem.data, slotItem.extra);
								//itemContainer.setText('slot' + this.num, cutNumber(slotItem.count - _count));
								itemContainer.setSlot(slot, slotItem.id, slotItem.count - _count, slotItem.data, slotItem.extra);
							}
						}
						setItemInfoSlot(slot, itemContainer);
						gridData.lowPriority = true;
						var map = (asdgfasdasddsad = gridData.networkData.getString('deleteItemsMap', 'null')) != 'null' ? JSON.parse(asdgfasdasddsad) : [];
						if(map.indexOf(slot) == -1){
							map.push(slot);
							gridData.networkData.putString('deleteItemsMap', JSON.stringify(map));
						}
						var currentCount = gridData.networkData.getInt(slot, 0);
						gridData.networkData.putInt(slot, currentCount + _count);
						gridData.networkData.putBoolean('update', true);
						gridData.networkData.putBoolean('updateFull'+slot, updateFull);
					}
				},
				size: cons + 1
			}
			asd++;
			_x += cons;
		}
		_y += cons;
	}
	elementsGUI_grid["slots_count"] = asd;
	elementsGUI_grid["x_count"] = x_count;
	elementsGUI_grid["y_count"] = y_count;
	elementsGUI_grid["x_start"] = x;
	elementsGUI_grid["x_end"] = _x;
	elementsGUI_grid["y_start"] = y;
	elementsGUI_grid["y_end"] = _y;
	elementsGUI_grid["cons"] = cons;

	gridData.slots_count = asd;
	gridData.x_count = x_count;
	gridData.y_count = y_count;
	gridData.cons = cons;

	var slider_frame_cons = 20;
	var slider_frame_border = 7;
	elementsGUI_grid["slider_frame"] = {
		type: "frame",
		x: 0,//_x + slider_frame_cons,
		y: y,
		width: 50,//(1000 - (_x + slider_frame_cons) - slider_frame_cons),
		height: y_count * cons,
		bitmap: "slider",
		scale: 1,
		onTouchEvent: function (element, event) {
			if (event.type == 'DOWN') {
				moving = true;
			}
			if (event.type == 'CLICK') {
				var itemContainerUiHandler = element.window.getContainer();
				var itemContainer = itemContainerUiHandler.getParent();
				var pages = gridFuncs.getPages(gridData.slotsKeys.length);
				var page = gridFuncs.getPageFromCoords(event, pages);
				gridSwitchPage(page, itemContainer);
			}
		}
	}
	elementsGUI_grid["slider_frame"].x = _x + (1000 - _x - elementsGUI_grid["slider_frame"].width) / 2;
	elementsGUI_grid["slider_button"] = {
		type: "button",
		x: elementsGUI_grid["slider_frame"].x + slider_frame_border,
		start_y: elementsGUI_grid["slider_frame"].y + slider_frame_border,
		y: elementsGUI_grid["slider_frame"].y + slider_frame_border,
		bitmap: 'slider_buttonOff',
		scale: (elementsGUI_grid["slider_frame"].width - slider_frame_border * 2) / 12
	}
	elementsGUI_grid["button_up"] = {
		type: "button",
		x: 0,
		y: 0,
		bitmap: 'but_up',
		bitmap2: 'but_upPressed',
		scale: elementsGUI_grid["slider_frame"].width/25,//Math.min((1000 - _x - slider_frame_cons * 2) / 25, (y - 30 - 10) / 15),
		clicker: {
			onClick: function (itemContainerUiHandler, itemContainer, element) {
				gridSwitchPage(gridData.lastPage - 1, itemContainer);
			},
			onLongClick: function (itemContainerUiHandler, container, element) {
			}
		}
	}
	elementsGUI_grid["slider_frame"].height -= 20 + elementsGUI_grid["button_up"].scale * 15;

	elementsGUI_grid["button_up"].x = _x + (1000 - _x - elementsGUI_grid["button_up"].scale * 25) / 2;
	elementsGUI_grid["button_up"].y = 20 + (50 - elementsGUI_grid["button_up"].scale * 15) / 2;

	elementsGUI_grid["button_down"] = {
		type: "button",
		x: _x + slider_frame_cons,
		y: y + elementsGUI_grid["slider_frame"].height + 20,
		bitmap: 'but_down',
		bitmap2: 'but_downPressed',
		scale: elementsGUI_grid["button_up"].scale,
		clicker: {
			onClick: function (itemContainerUiHandler, itemContainer, element) {
				gridSwitchPage(gridData.lastPage + 1, itemContainer);
			},
			onLongClick: function (itemContainerUiHandler, itemContainer, element) {
			}
		}
	}
	elementsGUI_grid["button_down"].x = _x + (1000 - _x - elementsGUI_grid["button_down"].scale * 25) / 2;
	elementsGUI_grid["button_down"].y = y + elementsGUI_grid["slider_frame"].height + (50 - elementsGUI_grid["button_down"].scale * 15) / 2;

	var settings_cons = 10;
	elementsGUI_grid.settings_cons = settings_cons;
	elementsGUI_grid["redstone_button"] = {
		type: "button",
		x: 0,
		y: y,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale: 2,
		clicker: {
			onClick: function (itemContainerUiHandler, container, element) {
				container.sendEvent("updateRedstoneMode", {});
			},
			onLongClick: function (itemContainerUiHandler, container, element) {

			}
		}
	}
	elementsGUI_grid["redstone_button"].x = x - settings_cons - (20 * elementsGUI_grid["redstone_button"].scale);

	elementsGUI_grid["image_redstone"] = {
		type: "image",
		x: elementsGUI_grid["redstone_button"].x,
		y: elementsGUI_grid["redstone_button"].y,
		z: 100,
		bitmap: "redstone_GUI_0",
		scale: elementsGUI_grid["redstone_button"].scale*20/16,
	}

	elementsGUI_grid["filter_button"] = {
		type: "button",
		x: 0,
		y: elementsGUI_grid["redstone_button"].y + (elementsGUI_grid["redstone_button"].scale * 20) + settings_cons,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale: 2,
		clicker: {
			onClick: function (itemContainerUiHandler, container, element) {
				container.sendEvent("updateFilter", {});
			},
			onLongClick: function (itemContainerUiHandler, container, element) {
				
			}
		}
	}
	elementsGUI_grid["filter_button"].x = x - settings_cons - (20 * elementsGUI_grid["filter_button"].scale);

	elementsGUI_grid["image_filter"] = {
		type: "image",
		x: elementsGUI_grid["filter_button"].x + (elementsGUI_grid["filter_button"].scale * 20 - 24) / 2,
		y: elementsGUI_grid["filter_button"].y + (elementsGUI_grid["filter_button"].scale * 20 - 24) / 2,
		z: 1000,
		bitmap: "RS_filter1",
		scale: 4,
	}

	elementsGUI_grid["reverse_filter_button"] = {
		type: "button",
		x: 0,
		y: elementsGUI_grid["filter_button"].y + (elementsGUI_grid["filter_button"].scale * 20) + settings_cons,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale: 2,
		clicker: {
			onClick: function (itemContainerUiHandler, container, element) {
				container.sendEvent("updateReverseFilter", {});
			},
			onLongClick: function (itemContainerUiHandler, container, element) {
				
			}
		}
	}
	elementsGUI_grid["reverse_filter_button"].x = x - settings_cons - (20 * elementsGUI_grid["reverse_filter_button"].scale);

	elementsGUI_grid["image_reverse_filter"] = {
		type: "image",
		x: 0,
		y: 0,
		z: 1000,
		bitmap: "RS_arrow_down",
		scale: 3.5,
	}
	elementsGUI_grid["image_reverse_filter"].x = elementsGUI_grid["reverse_filter_button"].x + (elementsGUI_grid["reverse_filter_button"].scale * 20 - (elementsGUI_grid["image_reverse_filter"].scale * 8)) / 2
	elementsGUI_grid["image_reverse_filter"].y = elementsGUI_grid["reverse_filter_button"].y + (elementsGUI_grid["reverse_filter_button"].scale * 20 - (elementsGUI_grid["image_reverse_filter"].scale * 10)) / 2

	max_y = (elementsGUI_grid["slider_frame"].y + elementsGUI_grid["slider_frame"].height) - 7 - elementsGUI_grid["slider_button"].scale * 15;
	elementsGUI_grid["max_y"] = max_y;
	gridData.maxY = max_y;
};
var _elementsGUI_grid = {};

var gridGUI = new UI.StandartWindow({
	standart: {
		header: {
			text: {
				text: Translation.translate("Grid")
			}
		},
		inventory: {
			padding: 20,
			width: 300 / 4 * 3
		},
		background: {
			standart: true
		}
	},

	drawing: [],

	elements: _elementsGUI_grid
});
GUIs.push(gridGUI);

var gridConsPercents = 50/(575.5 - 60);
grid_set_elements(315, 70, gridConsPercents*(UI.getScreenHeight() - 60), 0, _elementsGUI_grid, gridData, gridGUI);
gridGUI.getWindow('main').forceRefresh();

testButtons(gridGUI.getWindow('header').getContent().elements, function(){
	grid_set_elements(315, 70, gridConsPercents*(UI.getScreenHeight() - 60), 0, _elementsGUI_grid, gridData);
});

var inv_elements = gridGUI.getWindow('inventory').getContent();
inv_elements.elements["_CLICKFRAME_"] = {
	type: "frame",
	x: 0,
	y: 0,
	z: -100,
	width: 1000,
	height: 251*9,
	bitmap: "empty",
	scale: 1,
	onTouchEvent: function(element, event){
		if(event.type == 'CLICK' || event.type == 'LONG_CLICK'){
			if (!gridData.isWorkAllowed) return;
			var itemContainerUiHandler = element.window.getContainer();
			var itemContainer = itemContainerUiHandler.getParent();
			var slot_id = Math.floor(event.x/251)+Math.floor(event.y/250)*4;
			var updateFull = false;
			var item = Player.getInventorySlot(slot_id);
			if(item.id == 0)return;
			//alert(JSON.stringify(item));
			if(gridData.disksStored >= gridData.disksStorage) return
			if(event.type == 'CLICK'){
				var count = 1;
			} else {
				var count = Math.min(Item.getMaxStack(item.id), gridData.disksStorage - gridData.disksStored, item.count);
			}
			if(Config.dev)Logger.Log('Grid local pushing item: ' + getItemUid(item) + ' ; count: ' + count + ' ; slot: ' + slot_id + " ; extra: " + fullExtraToString(item.extra), 'RefinedStorageDebug');
			var slotFounded = false;
			for(var i in gridData.slotsKeys){
				var _slotName = gridData.slotsKeys[i];
				var _slot = itemContainer.slots[_slotName];
				//if(Config.dev)Logger.Log('Checking item: ' + getItemUid(_slot) + " ; extra: " + fullExtraToString(_slot.extra), 'RefinedStorageDebug');
				if(_slot && (_slot.id == 0 || (_slot.id == item.id && _slot.data == item.data && (item.extra == _slot.extra || (item.extra && _slot.extra && fullExtraToString(item.extra) == fullExtraToString(_slot.extra)))))){
					item.extra = _slot.extra;
					if(Config.dev)Logger.Log('Founded slot: ' + _slotName + ' : ' + JSON.stringify(_slot.asScriptable()), 'RefinedStorageDebug');
					slotFounded = true;
					itemContainer.setSlot(_slotName, item.id, _slot.count + count, item.data, item.extra || null);
					gridData.setItemInfoSlot(_slotName, itemContainer);
					if(gridData.sort == 0) updateFull = true;
					gridData.updateGui(true, updateFull);
					gridData.lowPriority = true;
					break
				}
			}
			if(!slotFounded){
				var _slotName = gridData.slotsKeys.length + 'slot';
				if(Config.dev)Logger.Log('Slot not founded, new slot name: ' + _slotName, 'RefinedStorageDebug');
				gridData.slotsKeys.push(_slotName);
				itemContainer.setSlot(_slotName, item.id, count, item.data, item.extra || null);
				gridData.setItemInfoSlot(_slotName, itemContainer);
				updateFull = true;
				gridData.updateGui(true, updateFull);
				gridData.lowPriority = true;
			}
			var map = (asdgfasdasddsad = gridData.networkData.getString('pushItemsMap', 'null')) != 'null' ? JSON.parse(asdgfasdasddsad) : [];
			if(map.indexOf(slot_id) == -1){
				map.push(slot_id);
				gridData.networkData.putString('pushItemsMap', JSON.stringify(map));
			}
			var currentCount = gridData.networkData.getInt(slot_id, 0);
			gridData.networkData.putInt(slot_id, currentCount + count);
			gridData.networkData.putBoolean('update', true);
			gridData.networkData.putBoolean('updateFull'+slot_id, updateFull);
		}
	}
}
function least_sort(a, b) { return a - b; };

function error(message) {
	alert(message);
	return false;
}

var gridFuncs = {
	getPages: function(_length){
		if(_length == 0) return 1;
		_length = Math.ceil(_length / _elementsGUI_grid["x_count"]);
		return _length;
	},
	getPageFromCoords: function(_coords, pages){
		pages -= _elementsGUI_craftingGrid['y_count'] - 1;
		var interval = (pages - 1) > 0 ? (_elementsGUI_grid["max_y"] - _elementsGUI_grid["slider_button"].start_y) / (pages - 1) : 0;
		function __getY(i) {
			return ((interval * i) + _elementsGUI_grid["slider_button"].start_y);
		}
		var least_dec = 10001;
		var finish_i = 0;
		for (var i = 0; i < pages; i++) {
			var dec = Math.abs(Math.round(_coords.y - __getY(i)));
			if (dec < least_dec) {
				least_dec = dec;
				finish_i = i;
			}
		};
		var page = finish_i;
		return page + 1;
	},
	getCoordsFromPage: function(page, pages){
		pages -= _elementsGUI_craftingGrid['y_count'] - 1;
		var interval = (pages - 1) > 0 ? (_elementsGUI_grid["max_y"] - _elementsGUI_grid["slider_button"].start_y) / (pages - 1) : 0;
		function __getY(i) {
			return ((interval * i) + _elementsGUI_grid["slider_button"].start_y);
		}
		if (page > pages) page = pages;
		if (page < 1) page = 1;
		return __getY(page - 1);
	},
	sort: function (type, reverse, slots) {
		if (reverse) {
			if (type == 2) {
				return function (a, b) { 
					return slots[b].id - slots[a].id 
				};
			} else if (type == 0) {
				return function (a, b) {
					var slot1 = slots[a], slot2 = slots[b];
					return slot1.count == 0 || slot2.count == 0 ? slot2.count - slot1.count : slot1.count - slot2.count;
				};
			} else if (type == 1) {
				return function (a, b) {
					var slot1 = slots[a], slot2 = slots[b];
					if(slot1.id == 0 || slot2.id == 0) return slot2.id - slot1.id;
					var name1 = getItemName(slot1.id, slot1.data, slot1.extra);
					var name2 = getItemName(slot2.id, slot2.data, slot2.extra);
					if (name1 > name2) {
						return 1;
					}
					if (name1 < name2) {
						return -1;
					}
					return 0;
				};
			}
		} else {
			if (type == 2) {
				return function (a, b) {
					var slot1 = slots[a], slot2 = slots[b];
					return slot1.id == 0 || slot2.id == 0 ? slot2.id - slot1.id : slot1.id - slot2.id 
				};
			} else if (type == 0) {
				return function (a, b) { 
					return slots[b].count - slots[a].count 
				};
			} else if (type == 1) {
				return function (a, b) {
					var slot1 = slots[a], slot2 = slots[b];
					if(slot1.id == 0 || slot2.id == 0) return slot2.id - slot1.id;
					var name1 = getItemName(slot1.id, slot1.data, slot1.extra);
					var name2 = getItemName(slot2.id, slot2.data, slot2.extra);
					if (name2 > name1) {
						return 1;
					}
					if (name2 < name1) {
						return -1;
					}
					return 0;
				};
			}
		}
	}
}

RefinedStorage.createTile(BlockID.RS_grid, {
	defaultValues: {
		NETWORK_ID: 'f',
		LAST_NETWORK_ID: 0,
		block_data: 0,
		page: 1,
		items: [],
		event: { x: 0, y: 0 },
		sort: 0,
		sort_map: ['count', 'name', 'id'],
		reverse_filter: false,
		page_switched: false,
		controller_coords: { x: 0, y: 0, z: 0 },
		slots_count: 0,
		textSearch: false,
		privateRemaked: false,
		pushDeleteEvents: {},
		firstOpen: false,
		firstOpenClients: [],
		fullRefreshPage: false
	},
	unsaveableSlots: true,
	useNetworkItemContainer: true,
	setActiveNotUpdateGui: true,
	click: function (id, count, data, coords, player, extra) {
		if(Entity.getSneaking(player)) return false;
		var client = Network.getClientForPlayer(player);
		if (!client || this.container.getNetworkEntity().getClients().contains(client)) return true;
		this.items();
		this.container.openFor(client, "main");
		/* this.data.firstOpen = World.getThreadTime() + 40;
		this.data.firstOpenClients.push(client); */
		/* var ths = this;
		setTimeout(function(){
			ths.refreshGui(true, client);
		},40); */
		if(InnerCore_pack.packVersionCode < 119)this.refreshGui(true, client); 
		return true;
	},
	onWindowClose: function(){
		if(this.data.NETWORK_ID == 'f') return;
		var coords_id = this.coords_id();
		RSNetworks[this.data.NETWORK_ID][coords_id].isOpenedGrid = false;
		if((iIndex = RSNetworks[this.data.NETWORK_ID].info.openedGrids.findIndex(function(element){return cts(element) == coords_id})) != -1) RSNetworks[this.data.NETWORK_ID].info.openedGrids.splice(iIndex, 1);
	},
	onWindowOpen: function(container, client){
		if(InnerCore_pack.packVersionCode >= 119)this.refreshGui(true, client); 
		if(this.data.NETWORK_ID == 'f') return;
		var coords_id = this.coords_id();
		RSNetworks[this.data.NETWORK_ID][coords_id].isOpenedGrid = true;
		if(RSNetworks[this.data.NETWORK_ID].info.openedGrids.findIndex(function(element){return cts(element) == coords_id}) == -1) RSNetworks[this.data.NETWORK_ID].info.openedGrids.push({x: this.x, y: this.y, z: this.z});
	},
	pre_init: function(){
		this.container.setGlobalGetTransferPolicy({
			transfer: function(itemContainer, slot, id, count, data, extra, player){
				return 0;
			}
		})
	},
	post_init: function(){
		/* this.data.firstOpen = false;
		this.data.firstOpenClients = []; */
		this.data.pushDeleteEvents = {};
	},
	tick: function () {
		/* if(this.data.firstOpen && this.data.firstOpen == World.getThreadTime()){
			for(var i in this.data.firstOpenClients){
				this.refreshGui(true, this.data.firstOpenClients[i]);
			}
			this.data.firstOpenClients = [];
			this.data.firstOpen = false;
		} */
		if (this.container.getNetworkEntity().getClients().iterator().hasNext()) {
			if(this.data.refreshCurPage){
				this.items();
				this.refreshGui(false, false, this.data.fullRefreshPage);
				this.data.refreshCurPage = false;
				this.data.fullRefreshPage = false;
			}
		}
		for(var p in this.data.pushDeleteEvents){
			var player = new PlayerActor(Number(p));
			//alert('Checking event of: ' + p);
			for(var i in this.data.pushDeleteEvents[p]){
				var event = this.data.pushDeleteEvents[p][i];
				//alert('Event: ' + JSON.stringify(event));
				if(!event) {
					delete this.data.pushDeleteEvents[p][i];
					continue;
				}
				if(event.type == 'push'){
					var item = player.getInventorySlot(event.slot);
					if(item.id == 0) return;
					var count = Math.min(event.count, item.count);
					var pushed = this.pushItem(item, count, true);
					if(pushed < count){
						player.setInventorySlot(event.slot, item.id, item.count - (count - pushed), item.data, item.extra);
					}
					if((_index = this.originalItemsMap().indexOf(getItemUid(item))) != -1)this.container.markSlotDirty(_index+'slot');
					this.items();
					this.refreshGui(false, false, item.count <= count || event.updateFull);
					delete this.data.pushDeleteEvents[p][i];
				}
				if(event.type == 'delete'){
					var item = this.container.getSlot(i);//event.item;
					var itemMaxStack = Item.getMaxStack(item.id);
					var this_item = searchItem(item.id, item.data, item.extra, false, true, p);
					var count = this_item && this_item.count < itemMaxStack ? Math.min(event.count, item.count, itemMaxStack - this_item.count) : Math.min(event.count, item.count/* , itemMaxStack*emptySlots.length */);
					if((res = this.deleteItem(item, count, true)) < count) {
						var _extra = (this_item ? this_item.extra : item.extra);
						player.addItemToInventory(item.id, count - res, item.data, _extra || null, true);
						this.items();
						this.refreshGui(false, false, item.count <= count || event.updateFull);
					}
					delete this.data.pushDeleteEvents[p][i];
				}
			}
			delete this.data.pushDeleteEvents[p];
		}
	},
	post_update_network: function () {
		this.data.controller_coords = searchController_net(this.data.NETWORK_ID);
		this.refreshGui(false, false, true);
	},
	post_setActive: function(){
		this.items();
		this.refreshGui(false, false, true, true);
	},
	controller_id: function () {
		if (this.data.NETWORK_ID == "f") return '0,0,0';
		return this.data.controller_coords.x + ',' + this.data.controller_coords.y + ',' + this.data.controller_coords.z;
	},
	pages: function () {
		if (this.container.getNetworkEntity().getClients().iterator().hasNext() && this.data.NETWORK_ID != "f") {
			return gridFuncs.getPages(this.originalItems().length)
		} else {
			return 1;
		}
	},
	items: function (forced) {
		if (!this.isWorkAllowed()) {
			return [];
		}
		var items = this.originalItems();
		var slotsKeys = Object.keys(this.container.slots);
		for(var i = 0; i < Math.max(slotsKeys.length, items.length); i++){
			var slot = this.container.getSlot(i+'slot');
			var slot2 = items[i] || {id:0, data:0, count:0, extra: null};
			if(forced || !compareSlots(slot, slot2)){
				this.container.setSlot(i+'slot', slot2.id, slot2.count, slot2.data, slot2.extra || null);
			}
		}
		this.container.sendChanges();
		return items;
	},
	originalItems: function(){
		if (!this.isWorkAllowed()) {
			return [];
		}
		return RSNetworks[this.data.NETWORK_ID].info.items;
	},
	originalItemsMap: function(){
		if (!this.isWorkAllowed()) {
			return [];
		}
		return RSNetworks[this.data.NETWORK_ID].info.items_map;
	},
	originalOnlyItemsMap: function(){
		if (!this.isWorkAllowed()) {
			return {};
		}
		return RSNetworks[this.data.NETWORK_ID].info.just_items_map;
	},
	originalOnlyItemsExtraMap: function(){
		if (!this.isWorkAllowed()) {
			return {};
		}
		return RSNetworks[this.data.NETWORK_ID].info.just_items_map_extra;
	},
	getDisksStorage: function(){
		if (!this.isWorkAllowed()) {
			return 0;
		}
		return RSNetworks[this.data.NETWORK_ID].info.storage;
	},
	getDisksStored: function(){
		if (!this.isWorkAllowed()) {
			return 0;
		}
		return RSNetworks[this.data.NETWORK_ID].info.stored;
	},
	pushItem: function (item, count, nonUpdate) {
		count = count || item.count;
		if (!this.isWorkAllowed()) return count;
		var res = RSNetworks[this.data.NETWORK_ID].info.pushItem(item, count, nonUpdate);
		if(this.post_pushItem)this.post_pushItem(item, count, res);
		return res;
	},
	deleteItem: function (item, count, nonUpdate) {
		count = count || item.count;
		if (!this.isWorkAllowed()) return count;
		var res = RSNetworks[this.data.NETWORK_ID].info.deleteItem(item, count, nonUpdate);
		if(this.post_deleteItem)this.post_deleteItem(item, count, res);
		return res;
	},
	post_destroy: function () {
		delete temp_data[this.coords_id()];
		for(var i in this.container.slots){
			this.container.clearSlot(i);
		}
	},
	refreshModel: function(){
		if(!this.networkEntity) return Logger.Log(Item.getName(this.blockInfo.id, this.blockInfo.data) + ' model on: ' + cts(this) + ' cannot be displayed');
		this.sendPacket("refreshModel", {block_data: this.data.block_data, isActive: this.data.isActive, coords: {x: this.x, y: this.y, z: this.z, dimension: this.dimension}});
	},
	refreshGui: function(first, client, updateFilters){
		var _data = {
			name: this.networkData.getName() + '', 
			isActive: this.data.isActive, 
			NETWORK_ID: this.data.NETWORK_ID,
			redstone_mode: this.data.redstone_mode,
			sort: this.data.sort,
			reverse_filter: this.data.reverse_filter,
			refresh: !first,
			updateFilters: first || updateFilters,
			disksStorage: this.getDisksStorage() + "",
			disksStored: this.getDisksStored(),
			isWorkAllowed: this.isWorkAllowed()
			//slotsLength: Object.keys(this.container.slots).length
		};
		if(client){
			this.container.sendEvent(client, "openGui", _data);
		} else {
			this.container.sendEvent("openGui", _data);
		}
	},
	getScreenByName: function(screenName) {
		if(screenName == 'main')return gridGUI;
	},
	client: {
		refreshModel: function(){
			if(Config.dev)Logger.Log('Local refreshing Grid model: block_data: ' + this.networkData.getInt('block_data') + ' ; isActive: ' + this.networkData.getBoolean('isActive'), 'RefinedStorageDebug');
			var render = new ICRender.Model();
			var model = BlockRenderer.createTexturedBlock(getGridTexture(this.networkData.getInt('block_data'), this.networkData.getBoolean('isActive')));
			render.addEntry(model);
			BlockRenderer.mapAtCoords(this.x, this.y, this.z, render);
		},
		tick: function(){
			if(this.networkData.getBoolean('update', false)){
				this.networkData.putBoolean('update', false);
				var pushDeleteEvents = {};
				var map = (asdgfasdasddsad = this.networkData.getString('deleteItemsMap', 'null')) != 'null' ? JSON.parse(asdgfasdasddsad) : [];
				for(var i in map){
					pushDeleteEvents[map[i]] = {
						type: 'delete',
						count: Number(this.networkData.getInt(map[i], 0)),
						updateFull: this.networkData.getBoolean('updateFull'+map[i], false)
					}
					this.networkData.putInt(map[i], 0);
				}
				this.networkData.putString('deleteItemsMap', 'null');
				var map = (asdgfasdasddsad = this.networkData.getString('pushItemsMap', 'null')) != 'null' ? JSON.parse(asdgfasdasddsad) : [];
				for(var i in map){
					pushDeleteEvents[map[i]] = {
						type: 'push',
						count: Number(this.networkData.getInt(map[i], 0)),
						slot: map[i],
						updateFull: this.networkData.getBoolean('updateFull'+map[i], false)
					}
					this.networkData.putInt(map[i], 0);
				}
				this.networkData.putString('pushItemsMap', 'null');
				this.sendPacket("pushDeleteEvents", {pushDeleteEvents: pushDeleteEvents})
			}
		},
		events: {
			refreshModel: function(eventData, packetExtra) {
				if(Config.dev)Logger.Log('Event refreshing Grid model: block_data: ' + this.networkData.getInt('block_data') + ' ; isActive: ' + this.networkData.getBoolean('isActive') + ' ; eventIsActive: ' + eventData.isActive, 'RefinedStorageDebug');
				var render = new ICRender.Model();
				var model = BlockRenderer.createTexturedBlock(getGridTexture(eventData.block_data, eventData.isActive));
				render.addEntry(model);
				BlockRenderer.mapAtCoords(eventData.coords.x, eventData.coords.y, eventData.coords.z, render);
			}
		},
		containerEvents: {
			openGui: function(container, window, content, eventData){
				if(!content || !window || !window.isOpened()) return;
				eventData.disksStorage = Number(eventData.disksStorage);
				Object.assign(gridData, eventData);
				gridData.updateGui = function(refresh, updateFilters, nonlocal){
					if(Config.dev)Logger.Log((nonlocal ? 'Server ' : 'Local ') + (refresh ? 'Updating' : 'Openning') + ' window: refresh:' + refresh + ' updateFilters:' + updateFilters + ' eventdata:' + JSON.stringify(eventData), 'RefinedStorageDebug');
					delete container.slots.bindings;
					delete container.slots.slots;
					gridData.networkData = SyncedNetworkData.getClientSyncedData(eventData.name);
					if(updateFilters){
						var _slotKeys = [];
						for(var i in container.slots)if(i[0] >= 0 && container.slots[i].id != 0)_slotKeys.push(i);
						gridData.slotsKeys = _slotKeys;
						if(!refresh)gridData.textSearch = false;
						var millis = 0;
						if(Config.dev)millis = java.lang.System.currentTimeMillis();
						gridData.slotsKeys = ScriptableObjectHelper.createArray(RSJava.sortItems(eventData.sort, eventData.reverse_filter, gridData.textSearch ? gridData.textSearch : null, container, gridData.slotsKeys));
						if(Config.dev)Logger.Log('Items array sorted on: ' + (java.lang.System.currentTimeMillis() - millis), "RefinedStorageDebug");
						if(gridData.selectedItemInfoSlot)gridData.setItemInfoSlot(gridData.selectedItemInfoSlot, container);
					}
					content.elements["image_filter"].bitmap = 'RS_filter' + (eventData.sort + 1);
					content.elements["image_filter"].x = content.elements["filter_button"].x + (content.elements["filter_button"].scale * 20 - filter_size_map[eventData.sort]) / 2;
					if (eventData.reverse_filter) {
						content.elements["image_reverse_filter"].bitmap = 'RS_arrow_up';
					} else {
						content.elements["image_reverse_filter"].bitmap = 'RS_arrow_down';
					}
					content.elements["search_text"].text = gridData.textSearch ? gridData.textSearch : Translation.translate('Search');
					content.elements["image_redstone"].bitmap = 'redstone_GUI_' + (eventData.redstone_mode || 0);
					var slots_count = content.elements.slots_count;
					content.elements["slider_button"].bitmap = gridData.slotsKeys.length <= gridData.slots_count ? 'slider_buttonOff' : 'slider_buttonOn';
					//if(refresh)window.getWindow('main').getElements().get("slider_button").setPosition(content.elements['slider_button'].x, gridFuncs.getCoordsFromPage(gridData.lastPage, gridFuncs.getPages(gridData.slotsKeys.length)));
					if (!eventData.isWorkAllowed) {
						for (var i = 0; i < slots_count; i++) {
							content.elements['slot' + i].bitmap = 'classic_darken_slot';
						}
						content.elements["slider_button"].bitmap = 'slider_buttonOff';
					} else if (content.elements['slot0'].bitmap == 'classic_darken_slot') {
						for (var i = 0; i < slots_count; i++) {
							content.elements['slot' + i].bitmap = 'classic_slot';
						}
					}
					gridSwitchPage(refresh ? gridData.lastPage : 1, container, true);
				}
				if(gridData.lowPriority){
					gridData.lowPriority = false;
					var craftsThread = java.lang.Thread({
						run: function(){
							try {
								gridData.updateGui(eventData.refresh, eventData.updateFilters, true);
							} catch(err){
								alert('Sorry, i broke :_(' + JSON.stringify(err));
							}
						}
					});
					craftsThread.setPriority(java.lang.Thread.MIN_PRIORITY);
					craftsThread.start();
				} else {
					gridData.updateGui(eventData.refresh, eventData.updateFilters, true);
				}
			}
		}
	},
	containerEvents: {
		updateFilter: function(eventData, connectedClient) {
			if(this.data.sort == undefined) this.data.sort = 0;
			this.data.sort = this.data.sort >= 2 ? 0 : this.data.sort + 1;
			this.refreshGui(false, false, true);
		},
		updateReverseFilter: function(eventData, connectedClient) {
			this.data.reverse_filter = !this.data.reverse_filter;
			this.refreshGui(false, false, true);
		}
	},
	events: {
		pushDeleteEvents: function(packetData, packetExtra, connectedClient) {
			this.data.pushDeleteEvents[connectedClient.getPlayerUid()] = packetData.pushDeleteEvents;
			if(Config.dev)Logger.Log('Getted pushDeleteEvents from: ' + connectedClient.getPlayerUid() + ' : ' + JSON.stringify(packetData.pushDeleteEvents), 'RefinedStorageDebug');
		}
	}
})