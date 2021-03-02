const _craftingGridTexture = [
	["disk_drive_bottom", 0], // bottom
	["grid_top", 0], // top
	["grid_back", 0], // back
	["crafting_grid_front", 0], // front
	["grid_left", 0], // left
	["grid_right", 0]  // right
];

function getCraftingGridTexture(variation, _active){
	variation = variation || 0;
	var i = _active ? 1 : 0;
	return [[_craftingGridTexture[0], [_craftingGridTexture[1][0], 0], _craftingGridTexture[2], [_craftingGridTexture[3][0], i], _craftingGridTexture[4], _craftingGridTexture[5]], [_craftingGridTexture[0], [_craftingGridTexture[1][0], 1], [_craftingGridTexture[3][0], i], _craftingGridTexture[2], _craftingGridTexture[5], _craftingGridTexture[4]], [_craftingGridTexture[0], [_craftingGridTexture[1][0], 2], _craftingGridTexture[5], _craftingGridTexture[4], _craftingGridTexture[2], [_craftingGridTexture[3][0], i]], [_craftingGridTexture[0], [_craftingGridTexture[1][0], 3], _craftingGridTexture[4], _craftingGridTexture[5], [_craftingGridTexture[3][0], i], _craftingGridTexture[2]]][variation];
}

IDRegistry.genBlockID("RS_crafting_grid");
Block.createBlockWithRotation("RS_crafting_grid", [
	{
		name: "Crafting Grid",
		texture: [
            ['stone', 0]
        ],
		inCreative: true
	}
])
mod_tip(BlockID['RS_crafting_grid']);
RS_blocks.push(BlockID['RS_crafting_grid']);
EnergyUse[BlockID['RS_crafting_grid']] = Config.energy_uses.craftingGrid;


var craftingGridData = Object.assign({}, gridData);
craftingGridData.lastCraftsPage = -1;
craftingGridData.darkenSlots = {};
craftingGridData.isCrafting = true;

var _elementsGUI_craftingGrid = {};

var _drawingGUI_craftingGrid = [];
var craftingGridGUI = new UI.StandartWindow({
	standart: {
		header: {
			text: {
				text: Translation.translate("Crafting Grid")
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

	drawing: _drawingGUI_craftingGrid,

	elements: _elementsGUI_craftingGrid
});
GUIs.push(craftingGridGUI);

function craftingGridSwitchPage(page, container, ignore, dontMoveSlider){
	if(Config.dev)Logger.Log('Switch crafting grid Page; page: ' + page + ' ; ignore: ' + ignore + ' ; dontMoveSlider: ' + dontMoveSlider + ' ; container: ' + container + ' ; craftingGridData: '/*  + JSON.stringify(asd1, null, '\t') */, 'RefinedStorageDebug');
	if(!container.getUiAdapter() || !container.getUiAdapter().getWindow() || !container.getUiAdapter().getWindow().isOpened()) return false;
	var slots = container.slots;
	var slotsKeys = craftingGridData.slotsKeys;
	var slots_count = craftingGridData.slots_count;
	var x_count = craftingGridData.x_count;
	var pages1 = craftingGridFuncs.getPages(slotsKeys.length);
	var pages = Math.max(1, pages1 + 1 - craftingGridData.y_count);
	page = Math.max(1, Math.min(page, pages)) - 1;
	if(page == craftingGridData.lastPage - 1 && !ignore) return false;
	craftingGridData.lastPage = page + 1;
	if(!dontMoveSlider){
		var pages = craftingGridFuncs.getPages(slotsKeys.length);
		var ___y = craftingGridFuncs.getCoordsFromPage(page + 1, pages);
		container.getUiAdapter().getElement("slider_button").setPosition(_elementsGUI_craftingGrid['slider_button'].x, ___y);
	}
	if (!craftingGridData.isWorkAllowed) {
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
		container.markSlotDirty("slot" + a);
		elements_.get("slot" + a).setBinding('text', cutNumber(item.count, true) + "");
		//container.setText("slot" + a, cutNumber(item.count));
		container.setSlot("slot" + a, item.id, item.count, item.data, item.extra || null);
	}
	return true;
}

function craftingGridSwitchCraftsPage(page, container, ignore, dontMoveSlider){
	//var asd1 = Object.assign(craftingGridData);
	//delete asd1.networkData;
	if(Config.dev)Logger.Log('Switch Crafts Page; page: ' + page + ' ; ignore: ' + ignore + ' ; dontMoveSlider: ' + dontMoveSlider + ' ; container: ' + container + ' ; craftingGridData: '/*  + JSON.stringify(asd1, null, '\t') */, 'RefinedStorageDebug');
	if(!container.getUiAdapter() || !container.getUiAdapter().getWindow() || !container.getUiAdapter().getWindow().isOpened()) return false;
	var crafts = craftingGridData.crafts;
	var slots_count = craftingGridData.crafts_slots_count;
	var x_count = craftingGridData.crafts_x_count;
	var pages1 = craftingGridFuncs.craftsPages(crafts.length);
	var pages = Math.max(1, pages1 + 1 - craftingGridData.crafts_y_count);
	page = Math.max(1, Math.min(page, pages)) - 1;
	if(page == craftingGridData.lastCraftsPage - 1 && !ignore) return false;
	craftingGridData.lastCraftsPage = page + 1;
	var uiAdapter = container.getUiAdapter();
	if(!dontMoveSlider){
		var ___y = craftingGridFuncs.getCraftsCoordsFromPage(page + 1, pages1);
		uiAdapter.getElement("crafts_slider").setPosition(_elementsGUI_craftingGrid['crafts_slider'].x, ___y);
	}
	if (!craftingGridData.isWorkAllowed) {
		for (var i = 0; i < slots_count; i++) {
			container.setSlot("item_craft_slot" + i, 0, 0, 0, null);
		}
		return false;
	}
	var window = uiAdapter.getWindow();
	var content = window.getContent();
	var window1 = window.getWindow('main');
	var contentProvider = window1.getContentProvider();
	for (var i = 0; i < slots_count; i++) {
		var a = i + (page * x_count);
		var item = crafts[a] ? crafts[a].getResult() : { id: 0, data: 0, count: 0, extra: null };
		container.setSlot("item_craft_slot" + i, item.id, item.count, item.data > 0 ? item.data : 0, item.extra || null);
		if(crafts[a])content.elements["item_craft_slot" + i].darken = craftingGridData.isDarkenMap["e" + crafts[a].getRecipeUid()];//craftingGridFuncs.isDarkenSlot(crafts[a], craftingGridData.originalOnlyItemsMap, craftingGridData.originalItemsMap, a);
	}
	contentProvider.refreshElements();
	return true;
}

testButtons(craftingGridGUI.getWindow('header').getContent().elements, function(){
	grid_set_elements(360 + 109, 70, CgridConsPercents*(UI.getScreenHeight() - 60), 0, _elementsGUI_craftingGrid, craftingGridData, craftingGridGUI, craftingGridSwitchPage);
});

var CgridConsPercents = 49/(575.5 - 60);
grid_set_elements(360 + 109, 70, CgridConsPercents*(UI.getScreenHeight() - 60), 0, _elementsGUI_craftingGrid, craftingGridData, craftingGridGUI, craftingGridSwitchPage);

(function(){
	_elementsGUI_craftingGrid["reverse_filter_button"].y = _elementsGUI_craftingGrid["search_frame"].y;
	_elementsGUI_craftingGrid["reverse_filter_button"].x = 245 + ((_elementsGUI_craftingGrid["search_frame"].x - 245)/2 + _elementsGUI_craftingGrid["reverse_filter_button"].scale*10 + _elementsGUI_craftingGrid.settings_cons);
	_elementsGUI_craftingGrid["image_reverse_filter"].x = _elementsGUI_craftingGrid["reverse_filter_button"].x + (_elementsGUI_craftingGrid["reverse_filter_button"].scale * 20 - (_elementsGUI_craftingGrid["image_reverse_filter"].scale * 8)) / 2
	_elementsGUI_craftingGrid["image_reverse_filter"].y = _elementsGUI_craftingGrid["reverse_filter_button"].y + (_elementsGUI_craftingGrid["reverse_filter_button"].scale * 20 - (_elementsGUI_craftingGrid["image_reverse_filter"].scale * 10)) / 2
	_elementsGUI_craftingGrid["filter_button"].y = _elementsGUI_craftingGrid["reverse_filter_button"].y;
	_elementsGUI_craftingGrid["filter_button"].x = _elementsGUI_craftingGrid["reverse_filter_button"].x - _elementsGUI_craftingGrid["reverse_filter_button"].scale*20 - _elementsGUI_craftingGrid.settings_cons;
	_elementsGUI_craftingGrid["image_filter"].y = _elementsGUI_craftingGrid["filter_button"].y + (_elementsGUI_craftingGrid["filter_button"].scale * 20 - 24) / 2;
	_elementsGUI_craftingGrid["image_filter"].x = _elementsGUI_craftingGrid["filter_button"].x + (_elementsGUI_craftingGrid["filter_button"].scale * 20 - 24) / 2;
	_elementsGUI_craftingGrid["redstone_button"].y = _elementsGUI_craftingGrid["filter_button"].y;
	_elementsGUI_craftingGrid["redstone_button"].x = _elementsGUI_craftingGrid["filter_button"].x - _elementsGUI_craftingGrid["filter_button"].scale*20 - _elementsGUI_craftingGrid.settings_cons;
	_elementsGUI_craftingGrid["image_redstone"].y = _elementsGUI_craftingGrid["redstone_button"].y;
	_elementsGUI_craftingGrid["image_redstone"].x = _elementsGUI_craftingGrid["redstone_button"].x;

	var windowHeight = UI.getScreenHeight() - 60;
	var craftingPadding = 10;
	var craftingY = _elementsGUI_craftingGrid["redstone_button"].y + _elementsGUI_craftingGrid["redstone_button"].scale*20 + 10;
	var craftSlotsPercents = 37/(575.5 - 60);
	var craftSlotsSize = craftSlotsPercents*windowHeight;
	var craftResultPercents = (37+10)/37;
	var craftResultSize = craftResultPercents*craftSlotsSize;
	_elementsGUI_craftingGrid['craft_result'] = {
		type: "slot",
		x: _elementsGUI_craftingGrid["x_start"] - craftingPadding - 50 - 20,
		y: craftingY + craftSlotsSize*1.5 - craftResultSize/2,
		clicker: {
			onClick: function (itemContainerUiHandler, itemContainer, element) {
				if(!craftingGridData.selectedRecipe || !craftingGridData.selectedRecipe.craftable) return;
				craftingGridFuncs.provideCraft(craftingGridData.selectedRecipe.result.count);
			},
			onLongClick: function (itemContainerUiHandler, itemContainer, element) {
				if(!craftingGridData.selectedRecipe || !craftingGridData.selectedRecipe.craftable) return;
				var result = craftingGridData.selectedRecipe.result;
				var maxStack = Item.getMaxStack(result.id);
				craftingGridFuncs.provideCraft(maxStack);
			}
		},
		size: craftResultSize
	}

	_elementsGUI_craftingGrid['craft_cleaner'] = {
		type: "button",
		x: _elementsGUI_craftingGrid['craft_result'].x + _elementsGUI_craftingGrid['craft_result'].size/4,
		y: _elementsGUI_craftingGrid['craft_result'].y - 5 - _elementsGUI_craftingGrid['craft_result'].size/2,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		clicker: {
			onClick: function (itemContainerUiHandler, itemContainer, element) {
				craftingGridData.selectedRecipe = null;
				itemContainer.setSlot('craft_result', 0, 0, 0);
				for(i = 0; i < 9; i++){
					itemContainer.setSlot('craft_slot' + i, 0, 0, 0);
					itemContainer.setSlot('WB_craft_slot' + i, 0, 0, 0);
				}
			},
			onLongClick: function (itemContainerUiHandler, itemContainer, element) {
			}
		},
		scale: _elementsGUI_craftingGrid['craft_result'].size/2/20
	}

	
	_elementsGUI_craftingGrid["image_craft_cleaner"] = {
		type: "image",
		x: _elementsGUI_craftingGrid["craft_cleaner"].x,
		y: _elementsGUI_craftingGrid["craft_cleaner"].y,
		z: 100,
		bitmap: "RS_close_button_icon",
		scale: _elementsGUI_craftingGrid['craft_cleaner'].scale,
	}

	var asd = 0;
	for(var y = 0; y < 3; y += 1){
		for(var x = 0; x < 3; x += 1){
			_elementsGUI_craftingGrid['craft_slot' + asd] = {
				id: 'craft_slot' + asd,
				type: "slot",
				x: 245 + craftingPadding + craftSlotsSize*x,
				y: craftingY + craftSlotsSize*y,
				clicker: {
					onClick: function (itemContainerUiHandler, itemContainer, element) {
						if(!this.parent) return;
						craftingGridData.setItemInfoSlot(this.parent, itemContainer);
					},
					onLongClick: function (itemContainerUiHandler, itemContainer, element) {
						
					}
				},
				size: craftSlotsSize
			}
			asd++;
		}
	}
	x = 245 + craftingPadding + craftSlotsSize*3;
	y = craftingY + craftSlotsSize*3;
	var craftSlotsEnd = y;

	var craftsSlotsXSettings = {
		count: 5,
		start: 245 + craftingPadding,
		end: _elementsGUI_craftingGrid['x_start'] - craftingPadding - 20
	}
	var craftsSlotsCons = (craftsSlotsXSettings.end - craftsSlotsXSettings.start)/craftsSlotsXSettings.count;
	var craftsSlotsYSettings = {
		start: craftSlotsEnd + 30,
		end: windowHeight - 20 - craftsSlotsCons
	}

	_elementsGUI_craftingGrid["search_frame_crafts"] = {
		type: "frame",
		x: craftsSlotsXSettings.start,
		y: craftSlotsEnd + 5,
		width: craftsSlotsXSettings.end - craftsSlotsXSettings.start,
		height: 20,
		bitmap: "search_bar",
		scale: 0.8,
		clicker: {
			onClick: function (itemContainerUiHandler, itemContainer, element) {
				UI.getContext().runOnUiThread(new java.lang.Runnable({// I take this from Recipe Viewer https://icmods.mineprogramming.org/mod?id=455 :D
					run: function () {
						try {
							var editText = new android.widget.EditText(UI.getContext());
							new android.app.AlertDialog.Builder(UI.getContext())
								.setTitle(Translation.translate("Please type the keywords"))
								.setView(editText)
								.setPositiveButton(Translation.translate("Search"), {
									onClick: function () {
										var keyword = editText.getText() + "";
										craftingGridData.craftsTextSearch = keyword.length ? keyword : false;
										itemContainerUiHandler.setBinding('search_text_crafts', 'text', keyword.length ? keyword : Translation.translate('Search'));
										craftingGridData.crafts = craftingGridFuncs.updateCrafts(craftingGridData.slotsKeys, craftingGridData.craftsTextSearch, craftingGridData.originalOnlyItemsMap, itemContainer.slots);
										craftingGridData.darkenSlots = {};
										craftingGridSwitchCraftsPage(1, itemContainer, true);
									}
								}).show();
						} catch (e) {
							alert(e);
						}
					}
				}));
			}
		}
	}

	_elementsGUI_craftingGrid["search_text_crafts"] = {
		type: "text",
		x: _elementsGUI_craftingGrid["search_frame_crafts"].x + 10,
		y: _elementsGUI_craftingGrid["search_frame_crafts"].y + 1,
		z: 100,
		text: Translation.translate('Search')/*'Search'*/,
		font: {
			color: android.graphics.Color.WHITE,
			shadow: 0.5,
			size: _elementsGUI_craftingGrid["search_frame_crafts"].height - 8
		}
	}
	
	var asdd = 0;
	for(var y = craftsSlotsYSettings.start; y < craftsSlotsYSettings.end; y += craftsSlotsCons){
		for(var x = craftsSlotsXSettings.start; x < craftsSlotsXSettings.end; x += craftsSlotsCons){
			_elementsGUI_craftingGrid['item_craft_slot' + asdd] = {
				type: "slot",
				num: asdd,
				x: x,
				y: y,
				clicker: {
					onClick: function (itemContainerUiHandler, itemContainer, element) {
						try{
						var craft_ident = this.num + ((craftingGridData.lastCraftsPage || 1) - 1) * _elementsGUI_craftingGrid['crafts_x_count'];
						var craft = craftingGridData.crafts[craft_ident];
						craftingGridFuncs.selectRecipe(craft, itemContainer, craftingGridData.originalOnlyItemsExtraMap, craftingGridData.originalOnlyItemsMap, craftingGridData.originalItemsMap);
						}catch(eer){alert(JSON.stringify(eer))};
					},
					onLongClick: function (itemContainerUiHandler, itemContainer, element) {
						
					}
				},
				size: craftsSlotsCons
			}
			asdd++;
		}
	}
	craftingGridData.crafts_slots_count = _elementsGUI_craftingGrid['crafts_slots_count'] = asdd;
	craftingGridData.crafts_x_count = _elementsGUI_craftingGrid['crafts_x_count'] = Math.ceil((craftsSlotsXSettings.end - craftsSlotsXSettings.start)/craftsSlotsCons);
	craftingGridData.crafts_y_count = _elementsGUI_craftingGrid['crafts_y_count'] = Math.ceil((craftsSlotsYSettings.end - craftsSlotsYSettings.start)/craftsSlotsCons);
	
	craftingGridData.crafts_x_start = _elementsGUI_craftingGrid['crafts_x_start'] = craftsSlotsXSettings.start;
	craftingGridData.crafts_y_start = _elementsGUI_craftingGrid['crafts_y_start'] = craftsSlotsYSettings.start;
	craftingGridData.crafts_x_end = _elementsGUI_craftingGrid['crafts_x_end'] = craftsSlotsXSettings.end;
	craftingGridData.crafts_y_end = _elementsGUI_craftingGrid['crafts_y_end'] = y - 1;

	_drawingGUI_craftingGrid.push({
		type: "line", 
		x1: craftsSlotsXSettings.end + 30/2, 
		y1: craftsSlotsYSettings.start, 
		x2: craftsSlotsXSettings.end + 30/2, 
		y2: y - 1, 
		width: 3, 
		color: android.graphics.Color.BLACK
	})

	var moving = false;
	var max_y = 0;
	var swipe_y;
	var swipe_sum = 0;

	_elementsGUI_craftingGrid.clickFrameTouchEvents.push(function (element, event) {
		var content = {elements:_elementsGUI_craftingGrid};/* element.window.getContent(); *///getContainer().getGuiContent();
		var itemContainerUiHandler = element.window.getContainer();
		var itemContainer = itemContainerUiHandler.getParent();
		if (event.type == "DOWN" && !swipe_y && event.x > _elementsGUI_craftingGrid["crafts_x_start"] && event.x < _elementsGUI_craftingGrid["crafts_x_end"] && event.y > _elementsGUI_craftingGrid["crafts_y_start"] && event.y < _elementsGUI_craftingGrid["crafts_y_end"]) {
			swipe_y = event.y;
		} else if (swipe_y && event.type == "MOVE") {
			var distance = Math.abs(event.y - swipe_y);
			function moveSwitchPage_(_n){
				_n = (_n ? 1 : -1);
				craftingGridSwitchCraftsPage(craftingGridData.lastCraftsPage + _n, itemContainer);
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
		event.y -= content.elements["crafts_slider"].scale * 15 / 2;
		if (event.type != 'UP' && event.type != "CLICK") {
			var page = craftingGridFuncs.getCraftsPageFromCoords(event, craftingGridFuncs.craftsPages(craftingGridData.crafts.length));
			itemContainerUiHandler.getElement("crafts_slider").setPosition(content.elements['crafts_slider'].x, Math.max(Math.min(event.y, max_y), content.elements["crafts_slider"].start_y));
			craftingGridSwitchCraftsPage(page, itemContainer, false, true);
		}
		if (event.type == "UP" || event.type == "CLICK") {
			moving = false;
			var pages = craftingGridFuncs.craftsPages(craftingGridData.crafts.length);
			var page = craftingGridFuncs.getCraftsPageFromCoords(event, pages);
			craftingGridSwitchCraftsPage(page, itemContainer);
			var ___y = craftingGridFuncs.getCraftsCoordsFromPage(page, pages);
			itemContainerUiHandler.getElement("crafts_slider").setPosition(_elementsGUI_craftingGrid['crafts_slider'].x, ___y);
		}
	})

	_elementsGUI_craftingGrid["crafts_slider"] = {
		type: "button",
		start_y: craftsSlotsYSettings.start,
		x: craftsSlotsXSettings.end + 30/2,
		y: craftsSlotsYSettings.start,
		z: 1,
		scale: 2,
		bitmap: 'craftsSlider',
		bitmap2: 'craftsSliderOn'
	}

	_elementsGUI_craftingGrid["crafts_slider_frame"] = {
		type: "frame",
		x: craftsSlotsXSettings.end,
		y: craftsSlotsYSettings.start - 10,
		width: 30,
		height: y - 1 - craftsSlotsYSettings.start + 20,
		z: -1,
		bitmap: 'empty1',
		onTouchEvent: function (element, event) {
			if (event.type == 'DOWN') {
				moving = true;
			}
			if (event.type == 'CLICK') {
				var itemContainerUiHandler = element.window.getContainer();
				var itemContainer = itemContainerUiHandler.getParent();
				var pages = craftingGridFuncs.craftsPages(craftingGridData.crafts.length);
				var page = craftingGridFuncs.getCraftsPageFromCoords(event, pages);
				craftingGridSwitchCraftsPage(page, itemContainer);
			}
		}
	}

	_elementsGUI_craftingGrid["crafts_slider"].x -= _elementsGUI_craftingGrid["crafts_slider"].scale*10/2;
	max_y = y - 1 - _elementsGUI_craftingGrid["crafts_slider"].scale*15;
	_elementsGUI_craftingGrid.crafts_max_y = max_y;
})();

var craftsInv_elements = craftingGridGUI.getWindow('inventory').getContent();
craftsInv_elements.elements["_CLICKFRAME_"] = {
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
			if (!craftingGridData.isWorkAllowed) return;
			var itemContainerUiHandler = element.window.getContainer();
			var itemContainer = itemContainerUiHandler.getParent();
			var slot_id = Math.floor(event.x/251)+Math.floor(event.y/250)*4;
			var updateFull = false;
			var item = Player.getInventorySlot(slot_id);
			if(item.id == 0)return;
			//alert(JSON.stringify(item));
			if(craftingGridData.disksStored >= craftingGridData.disksStorage) return
			if(event.type == 'CLICK'){
				var count = 1;
			} else {
				var count = Math.min(Item.getMaxStack(item.id), craftingGridData.disksStorage - craftingGridData.disksStored, item.count);
			}
			if(Config.dev)Logger.Log('Grid local pushing item: ' + getItemUid(item) + ' ; count: ' + count + ' ; slot: ' + slot_id + " ; extra: " + fullExtraToString(item.extra), 'RefinedStorageDebug');
			var slotFounded = false;
			for(var i in craftingGridData.slotsKeys){
				var _slotName = craftingGridData.slotsKeys[i];
				var _slot = itemContainer.slots[_slotName];
				//if(Config.dev)Logger.Log('Checking item: ' + _slotName + " ; UID: " + getItemUid(_slot) + " ; extra: " + fullExtraToString(_slot.extra), 'RefinedStorageDebug');
				if(_slot && (_slot.id == 0 || (_slot.id == item.id && _slot.data == item.data && (item.extra == _slot.extra || (item.extra && _slot.extra && fullExtraToString(item.extra) == fullExtraToString(_slot.extra)))))){
					item.extra = _slot.extra;
					if(Config.dev)Logger.Log('Founded slot: ' + _slotName + ' : ' + JSON.stringify(_slot.asScriptable()), 'RefinedStorageDebug');
					slotFounded = true;
					itemContainer.setSlot(_slotName, item.id, _slot.count + count, item.data, item.extra || null);
					craftingGridData.setItemInfoSlot(_slotName, itemContainer);
					if(craftingGridData.sort == 0) updateFull = true;
					craftingGridData.updateGui(true, updateFull);
					craftingGridData.lowPriority = true;
					break
				}
			}
			if(!slotFounded){
				var _slotName = craftingGridData.slotsKeys.length + 'slot';
				if(Config.dev)Logger.Log('Slot not founded, new slot name: ' + _slotName, 'RefinedStorageDebug');
				craftingGridData.slotsKeys.push(_slotName);
				itemContainer.setSlot(_slotName, item.id, count, item.data, item.extra || null);
				craftingGridData.setItemInfoSlot(_slotName, itemContainer);
				updateFull = true;
				craftingGridData.updateGui(true, updateFull);
				craftingGridData.lowPriority = true;
			}
			var map = (asdgfasdasddsad = craftingGridData.networkData.getString('pushItemsMap', 'null')) != 'null' ? JSON.parse(asdgfasdasddsad) : [];
			if(map.indexOf(slot_id) == -1){
				map.push(slot_id);
				craftingGridData.networkData.putString('pushItemsMap', JSON.stringify(map));
			}
			var currentCount = craftingGridData.networkData.getInt(slot_id, 0);
			craftingGridData.networkData.putInt(slot_id, currentCount + count);
			craftingGridData.networkData.putBoolean('update', true);
			craftingGridData.networkData.putBoolean('updateFull'+slot_id, updateFull);
		}
	}
};
craftingGridGUI.getWindow('main').forceRefresh();

for (var izxc = 0; izxc < 4; izxc++) {
	var render = new ICRender.Model();
	var model = BlockRenderer.createTexturedBlock(getCraftingGridTexture(izxc));
	render.addEntry(model);
	BlockRenderer.enableCoordMapping(BlockID["RS_crafting_grid"], izxc, render);
}

var craftingGridFuncs = {
	getPages: function(_length){
		if(_length == 0) return 1;
		_length = Math.ceil(_length / _elementsGUI_craftingGrid["x_count"]);
		return _length;
	},
	getPageFromCoords: function(_coords, pages){
		pages -= _elementsGUI_craftingGrid['y_count'] - 1;
		var interval = (pages - 1) > 0 ? (_elementsGUI_craftingGrid["max_y"] - _elementsGUI_craftingGrid["slider_button"].start_y) / (pages - 1) : 0;
		function __getY(i) {
			return ((interval * i) + _elementsGUI_craftingGrid["slider_button"].start_y);
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
		var interval = (pages - 1) > 0 ? (_elementsGUI_craftingGrid["max_y"] - _elementsGUI_craftingGrid["slider_button"].start_y) / (pages - 1) : 0;
		function __getY(i) {
			return ((interval * i) + _elementsGUI_craftingGrid["slider_button"].start_y);
		}
		if (page > pages) page = pages;
		if (page < 1) page = 1;
		return __getY(page - 1);
	},
	craftsPages: function(_length){
		if(_length == 0) return 1;
		_length = Math.ceil(_length / _elementsGUI_craftingGrid["crafts_x_count"]);
		return _length;
	},
	getCraftsPageFromCoords: function(_coords, pages){
		pages -= _elementsGUI_craftingGrid['crafts_y_count'] - 1;
		var interval = (pages - 1) > 0 ? (_elementsGUI_craftingGrid["crafts_max_y"] - _elementsGUI_craftingGrid["crafts_slider"].start_y) / (pages - 1) : 0;
		if(Config.dev)Logger.Log('interval: ' + interval + ' ; pages: ' + pages + ' ; _coords_y: ' + _coords.y + ' ; crafts_slider_start_y: ' + _elementsGUI_craftingGrid["crafts_slider"].start_y + ' ; crafts_max_y: ' + _elementsGUI_craftingGrid["crafts_max_y"] + ' ; crafts_x_count: ' + _elementsGUI_craftingGrid["crafts_x_count"], 'RefinedStorageDebug');
		function __getY(i) {
			return ((interval * i) + _elementsGUI_craftingGrid["crafts_slider"].start_y);
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
	getCraftsCoordsFromPage: function(page, pages){
		pages -= _elementsGUI_craftingGrid['crafts_y_count'] - 1;
		var interval = (pages - 1) > 0 ? (_elementsGUI_craftingGrid["crafts_max_y"] - _elementsGUI_craftingGrid["crafts_slider"].start_y) / (pages - 1) : 0;
		if(Config.dev)Logger.Log('interval: ' + interval + ' ; pages: ' + pages + ' ; page: ' + page + ' ; crafts_slider_start_y: ' + _elementsGUI_craftingGrid["crafts_slider"].start_y + ' ; crafts_max_y: ' + _elementsGUI_craftingGrid["crafts_max_y"] + ' ; crafts_x_count: ' + _elementsGUI_craftingGrid["crafts_x_count"], 'RefinedStorageDebug');
		function __getY(i) {
			return ((interval * i) + _elementsGUI_craftingGrid["crafts_slider"].start_y);
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
	},
	isDarkenSlot: function(javaRecipe, originalOnlyItemsMap, originalItemsMap, slot){
		if(!javaRecipe) return true;
		if(slot && craftingGridData.darkenSlots[slot] != null) return craftingGridData.darkenSlots[slot];
		var values = javaRecipe.getEntryCollection().iterator();
        while (values.hasNext()) {
			item = values.next();
			if(item.data == -1 ? !originalOnlyItemsMap[item.id] : originalItemsMap.indexOf(getItemUid(item)) == -1) {
				if(slot) craftingGridData.darkenSlots[slot] = true;
				return true;
			}
		}
		if(slot) craftingGridData.darkenSlots[slot] = false;
		return false;
	},
	updateCrafts: function(items, craftsTextSearch, onlyItemsMap, _object){
		var millis = java.lang.System.currentTimeMillis();
		var inventoryItems = searchItem(-1, -1, true);
		var inventoryOnlyItemsMap = {};
		for(var i in inventoryItems){
			if(inventoryOnlyItemsMap[inventoryItems[i].id])
				inventoryOnlyItemsMap[inventoryItems[i].id].push(inventoryItems[i].data);
			else
				inventoryOnlyItemsMap[inventoryItems[i].id] = [inventoryItems[i].data];
		}
		var sorted = ScriptableObjectHelper.createArray(RSJava.sortCrafts(items, craftsTextSearch ? craftsTextSearch : null, Object.assign(inventoryOnlyItemsMap, onlyItemsMap), _object, inventoryItems, craftingGridData.isDarkenMap));
		if(Config.dev)Logger.Log('Crafts array sorted on: ' + (java.lang.System.currentTimeMillis() - millis), "RefinedStorageDebug");
		return sorted;
	},
	selectRecipe: function(javaRecipe, container, originalOnlyItemsExtraMap, originalOnlyItemsMap, originalItemsMap){
		if (!javaRecipe) return false;
		var result_item = javaRecipe.getResult();
		if(!result_item) return false;
		container.setSlot('craft_result', result_item.id, result_item.count, result_item.data, result_item.extra || null);
		var items = javaRecipe.getSortedEntries();
		if(!items) return false;
		var smallItemsMap = {};
		var fixedItemsMap = {};
		var craftable = true;
		for(i = 0; i < 9; i++){
			if(!items[i] || !items[i].id){
				container.setSlot('craft_slot' + i, 0, 0, 0);
				_elementsGUI_craftingGrid['craft_slot' + i].parent = null;
				continue;
			};
			var item = items[i];
			itemData = item.data != -1 ? item.data : ((originalItem = originalOnlyItemsMap[item.id]) ? originalItem[0] : 0);
			var itemUid = item.id+'_'+itemData;
			var itemExtra = (itemExtraExist = originalOnlyItemsExtraMap[itemUid]) ? itemExtraExist[0] : null;
			if(itemExtra) itemUid += '_' + itemExtra.getValue();
			if(smallItemsMap[itemUid])
				smallItemsMap[itemUid]++;
			else
				smallItemsMap[itemUid] = 1;
			var itemCount = ((itemI = originalItemsMap.indexOf(itemUid)) != -1 && container.getSlot(craftingGridData.slotsKeys[itemI]).count >= smallItemsMap[itemUid]) ? 1 : 0;
			if(!itemCount) {
				var playerItem = searchItem(item.id, itemData, itemExtra);
				if(playerItem && playerItem.count >= smallItemsMap[itemUid] - (itemI != -1 ? container.getSlot(craftingGridData.slotsKeys[itemI]).count : 0)){
					itemExtra = playerItem.extra;
					itemCount = 1;
				} else {
					craftable = false;
				}
			}
			if(itemCount){
				if(fixedItemsMap[itemUid])
					fixedItemsMap[itemUid]++;
				else
					fixedItemsMap[itemUid] = 1;
			}
			container.setSlot('craft_slot' + i, item.id, itemCount, itemData, itemExtra);
			_elementsGUI_craftingGrid['craft_slot' + i].parent = craftingGridData.slotsKeys[itemI];
		}
		craftingGridData.selectedRecipe = {
			result: result_item,
			//items: smallItemsMap,
			//fixedItems: fixedItemsMap,
			javaRecipe: javaRecipe,
			craftable: craftable,
			//craftSlotsItems: craftSlotsItems,
			uid: javaRecipe.getRecipeUid()
		}
		//container.sendEvent('selectRecipe', {uid: javaRecipe.getRecipeUid()});
		return true;
	},
	provideCraft: function(count){
		if(!craftingGridData.selectedRecipe) return false;
		var _data = Object.assign({}, craftingGridData.selectedRecipe);
		_data.count = count;
		delete _data.javaRecipe;
		delete _data.result;
		craftingGridData.container.sendEvent('provideCraft', _data);
		return true;
	}
}

RefinedStorage.copy(BlockID.RS_grid, BlockID.RS_crafting_grid, {
	blockInfo: {
		id: BlockID.RS_crafting_grid
	},
	click: function (id, count, data, coords, player, extra) {
		if(Entity.getSneaking(player)) return false;
		var client = Network.getClientForPlayer(player);
		if (!client || this.container.getNetworkEntity().getClients().contains(client)) return true;
		this.items();
		this.container.openFor(client, "main");
		if(InnerCore_pack.packVersionCode < 119)this.refreshGui(true, client); 
		return true;
	},
	refreshModel: function(){
		if(!this.networkEntity) return Logger.Log(Item.getName(this.blockInfo.id, this.blockInfo.data) + ' model on: ' + cts(this) + ' cannot be displayed');
		this.sendPacket("refreshModel", {block_data: this.data.block_data, isActive: this.data.isActive, coords: {x: this.x, y: this.y, z: this.z, dimension: this.dimension}});
	},
	provideCraft: function(player){
		if(!this.isWorkAllowed() || !this.data.selectedRecipe || !this.data.selectedRecipe.craftable) return false;
		if(Config.dev)Logger.Log('Providing craft: result: ' + JSON.stringify(this.data.selectedRecipe.result), 'RefinedStorageDebug');
		var netFuncs = RSNetworks[this.data.NETWORK_ID].info;
		var selectedRecipe = this.data.selectedRecipe;
		var javaRecipe = selectedRecipe.javaRecipe;
		var items = javaRecipe.getSortedEntries();
		var smallItemsMap = {};
		for(i = 0; i < 9; i++){
			if(!items[i] || !items[i].id) {
				this.container.setSlot('WB_craft_slot' + i, 0,0,0);
				continue;
			}
			var item = items[i];
			itemData = item.data != -1 ? item.data : ((originalItem = this.originalOnlyItemsMap()[item.id]) ? originalItem[0] : 0);
			var itemUid = item.id+'_'+itemData;
			var itemExtra = (itemExtraExist = this.originalOnlyItemsExtraMap()[itemUid]) ? itemExtraExist[0] : null;
			if(itemExtra) {
				itemUid += '_' + itemExtra.getValue();
			}
			if(smallItemsMap[itemUid])
				smallItemsMap[itemUid].count++;
			else
				smallItemsMap[itemUid] = {id: item.id, count: 1, data: itemData, extra: itemExtra};
			this.container.setSlot('WB_craft_slot' + i, item.id, 1, itemData, itemExtra);
		}
		var playerSlots = {};
		for(var i in smallItemsMap){
			if(!netFuncs.itemCanBeDeleted(smallItemsMap[i]) && (!(playerSlots[i] = searchItem(smallItemsMap[i].id, smallItemsMap[i].data, smallItemsMap[i].extra, false, false, player)) || playerSlots[i].count < smallItemsMap[i].count)) return false;
		}
		var result = javaRecipe.provideRecipeForPlayer(this.container, player);
		if(!result) return false;
		if(result.data == -1)result.data = 0;
		var fixedEntries = this.container.asScriptableField();
		var __PlayerActor = new PlayerActor(player);
		for(var i in smallItemsMap){
			var ndeleted = netFuncs.deleteItem(smallItemsMap[i], smallItemsMap[i].count, true);
			if(ndeleted > 0 && (playerSlotData = playerSlots[i])){
				__PlayerActor.setInventorySlot(playerSlotData.slot, playerSlotData.id, playerSlotData.count - ndeleted, playerSlotData.data, playerSlotData.extra);
			}
		};
		var cbkUsedFunc = function(){
			for(var i = 0; i < 9; i++){
				var slot_ = fixedEntries[i];
				if(slot_.count != 0){
					var answ = this.pushItem(slot_, slot_.count, true);
					if(answ != 0){
						__PlayerActor.addItemToInventory(slot_.id, answ, slot_.data, null, true);
					}
				}
			}
		};
		cbkUsedFunc.apply(this);
		Callback.invokeCallback("VanillaWorkbenchCraft", result, this.container);
		__PlayerActor.addItemToInventory(result.id, result.count, result.data, result.extra || null, true);
		Callback.invokeCallback("VanillaWorkbenchPostCraft", result, this.container);
		return true;
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
				this.refreshGui(false, false, this.data.fullRefreshPage, this.data.fullRefreshPage);
				this.data.refreshCurPage = false;
				this.data.fullRefreshPage = false;
			}
		}
		for(var p in this.data.pushDeleteEvents){
			var player = new PlayerActor(Number(p));
			for(var i in this.data.pushDeleteEvents[p]){
				var event = this.data.pushDeleteEvents[p][i];
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
	post_init: function () {
		this.container.setWorkbenchFieldPrefix('WB_craft_slot');
		this.data.pushDeleteEvents = {};
	},
	refreshGui: function(first, client, updateFilters, updateCrafts){
		var _data = {
			name: this.networkData.getName() + '', 
			isActive: this.data.isActive, 
			NETWORK_ID: this.data.NETWORK_ID,
			redstone_mode: this.data.redstone_mode,
			sort: this.data.sort,
			reverse_filter: this.data.reverse_filter,
			refresh: !first,
			updateFilters: first || updateFilters,
			updateCrafts: first || updateCrafts,
			disksStorage: this.getDisksStorage() + "",
			disksStored: this.getDisksStored(),
			isWorkAllowed: this.isWorkAllowed(),
			craftsTextSearch: this.data.craftsTextSearch,
			first: first
			//slotsLength: Object.keys(this.container.slots).length
		};
		if(client){
			this.container.sendEvent(client, "openGui", _data);
		} else {
			this.container.sendEvent("openGui", _data);
		}
	},
	getScreenByName: function(screenName) {
		if(screenName == 'main')return craftingGridGUI;
	},
	client: {
		refreshModel: function(){
			if(Config.dev)Logger.Log('Local refreshing CraftingGrid model: block_data: ' + this.networkData.getInt('block_data') + ' ; isActive: ' + this.networkData.getBoolean('isActive'), 'RefinedStorageDebug');
			var render = new ICRender.Model();
			var model = BlockRenderer.createTexturedBlock(getCraftingGridTexture(this.networkData.getInt('block_data'), this.networkData.getBoolean('isActive')));
			render.addEntry(model);
			BlockRenderer.mapAtCoords(this.x, this.y, this.z, render);
		},
		ticks: 0,
		tick: function(){
			this.ticks++;
			if(this.networkData.getBoolean('update', false)){
				this.updateCrafts = true;
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
			if(this.updateCrafts && this.ticks%20 == 0){
				this.updateCrafts = false;
				craftingGridData.updateGui(true, false, true);
			}
		},
		events: {
			refreshModel: function(eventData, packetExtra) {
				if(Config.dev)Logger.Log('Event refreshing CraftingGrid model: block_data: ' + this.networkData.getInt('block_data') + ' ; isActive: ' + this.networkData.getBoolean('isActive') + ' ; eventIsActive: ' + eventData.isActive, 'RefinedStorageDebug');
				var render = new ICRender.Model();
				var model = BlockRenderer.createTexturedBlock(getCraftingGridTexture(eventData.block_data, eventData.isActive));
				render.addEntry(model);
				BlockRenderer.mapAtCoords(eventData.coords.x, eventData.coords.y, eventData.coords.z, render);
			}
		},
		containerEvents: {
			reselectRecipe: function(container, window, content, eventData){
				craftingGridFuncs.selectRecipe(craftingGridData.selectedRecipe.javaRecipe, container, craftingGridData.originalOnlyItemsExtraMap, craftingGridData.originalOnlyItemsMap, craftingGridData.originalItemsMap);
			},
			openGui: function(container, window, content, eventData){
				if(!content || !window || !window.isOpened()) return;
				eventData.disksStorage = Number(eventData.disksStorage);
				Object.assign(craftingGridData, eventData);
				craftingGridData.container = container;
				craftingGridData.updateGui = function(refresh, updateFilters, updateCrafts, nonlocal){
					if(!content || !window || !window.isOpened()) return;
					if(Config.dev)Logger.Log((nonlocal ? 'Server ' : 'Local ') + (refresh ? 'Updating' : 'Openning') + ' window: refresh:' + refresh + ' updateFilters:' + updateFilters + ' updateCrafts:' + updateCrafts + ' eventdata:' + JSON.stringify(eventData), 'RefinedStorageDebug');
					delete container.slots.bindings;
					delete container.slots.slots;
					craftingGridData.networkData = SyncedNetworkData.getClientSyncedData(eventData.name);
					var _slotKeys = [];
					if(updateFilters){
						var originalOnlyItemsExtraMap = {};
						var originalOnlyItemsMap = {};
						//var originalItemsMap = [];
						for(var i in container.slots)if(i[0] >= 0 && container.slots[i].id != 0){
							_slotKeys.push(i);
							var item_ = container.slots[i];
							if(originalOnlyItemsMap[item_.id] && originalOnlyItemsMap[item_.id].indexOf(item_.data) == -1){
								originalOnlyItemsMap[item_.id].push(item_.data);
							} else if(!originalOnlyItemsMap[item_.id]){
								originalOnlyItemsMap[item_.id] = [item_.data];
							}
							if(originalOnlyItemsExtraMap[item_.id+'_'+item_.data] && originalOnlyItemsExtraMap[item_.id+'_'+item_.data].indexOf(item_.extra) == -1){
								originalOnlyItemsExtraMap[item_.id+'_'+item_.data].push(item_.extra);
							} else if(!originalOnlyItemsExtraMap[item_.id+'_'+item_.data]){
								originalOnlyItemsExtraMap[item_.id+'_'+item_.data] = [item_.extra];
							}
							//originalItemsMap.push(getItemUid(item_));
						}
						craftingGridData.originalOnlyItemsExtraMap = originalOnlyItemsExtraMap;
						craftingGridData.originalOnlyItemsMap = originalOnlyItemsMap;
						craftingGridData.slotsKeys = _slotKeys;
						craftingGridData.crafts = [];
						if(!refresh)craftingGridData.textSearch = false;
						var millis = 0;
						if(Config.dev)millis = java.lang.System.currentTimeMillis();
						craftingGridData.slotsKeys = ScriptableObjectHelper.createArray(RSJava.sortItems(eventData.sort, eventData.reverse_filter, craftingGridData.textSearch ? craftingGridData.textSearch : null, container, craftingGridData.slotsKeys));
						if(Config.dev)Logger.Log('Items array sorted on: ' + (java.lang.System.currentTimeMillis() - millis), "RefinedStorageDebug");
						var originalItemsMap = craftingGridData.slotsKeys.map(function(__slot) {
							return getItemUid(container.slots[__slot]);
						});
						craftingGridData.originalItemsMap = originalItemsMap;
						if(craftingGridData.selectedItemInfoSlot)craftingGridData.setItemInfoSlot(craftingGridData.selectedItemInfoSlot, container);
					}
					content.elements["image_filter"].bitmap = 'RS_filter' + (eventData.sort + 1);
					content.elements["image_filter"].x = content.elements["filter_button"].x + (content.elements["filter_button"].scale * 20 - filter_size_map[eventData.sort]) / 2;
					if (eventData.reverse_filter) {
						content.elements["image_reverse_filter"].bitmap = 'RS_arrow_up';
					} else {
						content.elements["image_reverse_filter"].bitmap = 'RS_arrow_down';
					}
					content.elements["search_text"].text = craftingGridData.textSearch ? craftingGridData.textSearch : Translation.translate('Search');
					content.elements["image_redstone"].bitmap = 'redstone_GUI_' + (eventData.redstone_mode || 0);
					var slots_count = content.elements.slots_count;
					content.elements["slider_button"].bitmap = craftingGridData.slotsKeys.length <= craftingGridData.slots_count ? 'slider_buttonOff' : 'slider_buttonOn';
					var crafts_slots_count = content.elements.crafts_slots_count;
					if (!eventData.isWorkAllowed) {
						for (var i = 0; i < slots_count; i++) {
							content.elements['slot' + i].bitmap = 'classic_darken_slot';
						}
						content.elements["slider_button"].bitmap = 'slider_buttonOff';
						for (var i = 0; i < crafts_slots_count; i++) {
							content.elements['item_craft_slot' + i].bitmap = 'classic_darken_slot';
						}
					} else if (content.elements['slot0'].bitmap == 'classic_darken_slot') {
						for (var i = 0; i < slots_count; i++) {
							content.elements['slot' + i].bitmap = 'classic_slot';
						}
						content.elements["slider_button"].bitmap = 'slider_buttonOn';
						for (var i = 0; i < crafts_slots_count; i++) {
							content.elements['item_craft_slot' + i].bitmap = 'classic_slot';
						}
					}
					craftingGridSwitchPage(refresh ? craftingGridData.lastPage : 1, container, true);
					if(updateCrafts){
						var crafts2Thread = java.lang.Thread({
							run: function(){
								try {
									craftingGridData.isDarkenMap = {};
									craftingGridData.crafts = craftingGridFuncs.updateCrafts(craftingGridData.slotsKeys, craftingGridData.craftsTextSearch, craftingGridData.originalOnlyItemsMap, container.slots);
									craftingGridData.darkenSlots = {};
									craftingGridSwitchCraftsPage(refresh ? craftingGridData.lastCraftsPage : 1, container, true);
								} catch(err){
									alert('Error on sorting crafts: ' + JSON.stringify(err));
								}
							}
						});
						crafts2Thread.setPriority(java.lang.Thread.MIN_PRIORITY);
						crafts2Thread.start();
					}
				}
				if(!eventData.refresh)craftingGridData.selectedRecipe = null;
				for(var s = 0; s < 9; s++)content.elements['craft_slot' + s].parent = null;
				if(craftingGridData.lowPriority){
					craftingGridData.lowPriority = false;
					var craftsThread = java.lang.Thread({
						run: function(){
							try {
								craftingGridData.updateGui(eventData.refresh, eventData.updateFilters, eventData.updateCrafts, true);
							} catch(err){
								alert('Sorry, i broke :_(' + JSON.stringify(err));
							}
						}
					});
					craftsThread.setPriority(java.lang.Thread.MIN_PRIORITY);
					craftsThread.start();
				} else {
					craftingGridData.updateGui(eventData.refresh, eventData.updateFilters, eventData.updateCrafts, true);
				}
			}
		}
	},
	containerEvents: {
		updateRedstoneMode: function(eventData, connectedClient) {
			if(this.data.redstone_mode == undefined) this.data.redstone_mode = 0;
			this.data.redstone_mode = this.data.redstone_mode >= 2 ? 0 : this.data.redstone_mode + 1;
			if(!this.refreshRedstoneMode() && this.refreshGui) this.refreshGui();
		},
		updateFilter: function(eventData, connectedClient) {
			if(this.data.sort == undefined) this.data.sort = 0;
			this.data.sort = this.data.sort >= 2 ? 0 : this.data.sort + 1;
			this.refreshGui(false, false, true);
		},
		updateReverseFilter: function(eventData, connectedClient) {
			this.data.reverse_filter = !this.data.reverse_filter;
			this.refreshGui(false, false, true);
		},
		selectRecipe: function(eventData, connectedClient){
			//var javaRecipe = Recipes.getRecipeByUid(eventData.uid);
			//Callback.invokeCallback("VanillaWorkbenchRecipeSelected", javaRecipe, javaRecipe.getResult(), this.container);
		},
		provideCraft: function(eventData, connectedClient){
			this.data.selectedRecipe = eventData;
			this.data.selectedRecipe.javaRecipe = Recipes.getRecipeByUid(eventData.uid);
			this.data.selectedRecipe.result = this.data.selectedRecipe.javaRecipe.getResult();
			/* for(var i in eventData.craftSlotsItems){
				var item = eventData.craftSlotsItems[i];
				this.container.setSlot('WB_craft_slot' + i, item.id, item.count, item.data, item.extra);
			} */
			var result = this.data.selectedRecipe.result;
			for(var count = 0; count < eventData.count; count += result.count){
				if(!this.provideCraft(connectedClient.getPlayerUid())) break;
			}
			this.items();
			this.refreshGui(false, false, true, true);
			this.container.sendResponseEvent("reselectRecipe", {});
		}
	},
	events: {
		pushDeleteEvents: function(packetData, packetExtra, connectedClient) {
			/* for(var i in packetData.pushDeleteEvents){
				if(packetData.pushDeleteEvents[i].type == 'delete')packetData.pushDeleteEvents[i].item = this.container.getSlot(i).asScriptable();
			} */
			this.data.pushDeleteEvents[connectedClient.getPlayerUid()] = packetData.pushDeleteEvents;
			if(Config.dev)Logger.Log('Getted pushDeleteEvents from: ' + connectedClient.getPlayerUid() + '(' + Entity.getNameTag(connectedClient.getPlayerUid()) + ') : ' + JSON.stringify(packetData.pushDeleteEvents), 'RefinedStorageDebug');
		}
	}
});