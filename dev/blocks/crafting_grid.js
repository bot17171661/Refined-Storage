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

var _elementsGUI_craftingGrid = {};
grid_set_elements(360 + 109, 70, 49, 0, _elementsGUI_craftingGrid);
var _drawingGUI_craftingGrid = [];

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

	var craftingPadding = 10;
	var craftingY = _elementsGUI_craftingGrid["redstone_button"].y + _elementsGUI_craftingGrid["redstone_button"].scale*20 + 10;
	var craftSlotsSize = 37;
	var craftResultSize = craftSlotsSize + 10;
	_elementsGUI_craftingGrid['craft_result'] = {
		type: "slot",
		x: _elementsGUI_craftingGrid["x_start"] - craftingPadding - 50 - 20,
		y: craftingY + craftSlotsSize*1.5 - craftResultSize/2,
		clicker: {
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				tileEntity.provideCraft();
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
				if(!tileEntity.data.selectedRecipe) return;
				var result = tileEntity.data.selectedRecipe.result;
				var maxStack = Item.getMaxStack(result.id);
				for(var count = 0; count < maxStack; count += result.count){
					if(!tileEntity.provideCraft()) break;
				}
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
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				if(tileEntity.data.selectedRecipe){
					tileEntity.data.selectedRecipe = null;
					container.setSlot('craft_result', 0, 0, 0);
					for(i = 0; i < 9; i++){
						container.setSlot('craft_slot' + i, 0, 0, 0);
						container.setSlot('WB_craft_slot' + i, 0, 0, 0);
					}
				}
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
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
	for(var y = craftingY; y < craftingY + craftSlotsSize*3; y += craftSlotsSize){
		for(var x = 245 + craftingPadding; x < 245 + craftingPadding + craftSlotsSize*3; x += craftSlotsSize){
			_elementsGUI_craftingGrid['craft_slot' + asd] = {
				id: 'craft_slot' + asd,
				type: "slot",
				x: x,
				y: y,
				clicker: {
					onClick: function (position, container, tileEntity, window, canvas, scale) {
						var item = container.getSlot(this.id);
						if(item.id == 0) return;
						alert(Item.getName(item.id, item.data));
					},
					onLongClick: function (position, container, tileEntity, window, canvas, scale) {
						
					}
				},
				size: craftSlotsSize
			}
			asd++;
		}
	}
	var craftSlotsEnd = y;

	var craftsSlotsXSettings = {
		count: 5,
		start: 245 + craftingPadding,
		end: _elementsGUI_craftingGrid['x_start'] - craftingPadding - 20
	}
	var craftsSlotsCons = (craftsSlotsXSettings.end - craftsSlotsXSettings.start)/craftsSlotsXSettings.count;
	var craftsSlotsYSettings = {
		start: craftSlotsEnd + 30,
		end: UI.getScreenHeight() - 60 - 20 - craftsSlotsCons
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
			onClick: function (container, tileEntity, element) {
				/* var a = new android.widget.EditText(UI.getContext());
				a.setText('asdasdasdasd');
				a.layout(500, 500, 0, 0);
				craftingGridGUI.getWindow('main').layout.addView(a); */
				//UI.getContext().setContentView(a);
				UI.getContext().runOnUiThread(new java.lang.Runnable({// I take this from Recipe Viewer https://icmods.mineprogramming.org/mod?id=455 :D
					run: function () {
						try {
							var editText = new android.widget.EditText(UI.getContext());
							new android.app.AlertDialog.Builder(UI.getContext())
								.setTitle(Translation.translate("Please type the keywords"))
								.setView(editText)
								.setPositiveButton(Translation.translate("Search"), {
									onClick: function () {
										if (!container.isOpened()) return;
										var keyword = editText.getText() + "";
										_elementsGUI_craftingGrid["search_text_crafts"].text = keyword.length ? keyword : Translation.translate('Search');
										tileEntity.data.craftsTextSearch = keyword.length ? keyword : false;
										tileEntity.post_items();
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
					onClick: function (position, container, tileEntity, window, canvas, scale) {
						if(!tileEntity.data.isActive || tileEntity.data.crafts_page_switched) return;
						var craft_ident = this.num + ((tileEntity.data.craftsPage || 1) - 1) * _elementsGUI_craftingGrid['crafts_x_count'];
						var craft = tileEntity.getCrafts()[craft_ident];
						tileEntity.selectRecipe(craft);
					},
					onLongClick: function (position, container, tileEntity, window, canvas, scale) {
						
					}
				},
				size: craftsSlotsCons
			}
			asdd++;
		}
	}
	_elementsGUI_craftingGrid['crafts_slots_count'] = asdd;
	_elementsGUI_craftingGrid['crafts_x_count'] = Math.ceil((craftsSlotsXSettings.end - craftsSlotsXSettings.start)/craftsSlotsCons);
	_elementsGUI_craftingGrid['crafts_y_count'] = Math.ceil((craftsSlotsYSettings.end - craftsSlotsYSettings.start)/craftsSlotsCons);
	
	_elementsGUI_craftingGrid['crafts_x_start'] = craftsSlotsXSettings.start;
	_elementsGUI_craftingGrid['crafts_y_start'] = craftsSlotsYSettings.start;
	_elementsGUI_craftingGrid['crafts_x_end'] = craftsSlotsXSettings.end;
	_elementsGUI_craftingGrid['crafts_y_end'] = y - 1;

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
		var tile = element.window.getContainer().tileEntity;
		var content = element.window.getContainer().getGuiContent();
		if (event.type == "DOWN" && !swipe_y && event.x > content.elements["crafts_x_start"] && event.x < content.elements["crafts_x_end"] && event.y > content.elements["crafts_y_start"] && event.y < content.elements["crafts_y_end"]) {
			swipe_y = event.y;
		} else if (swipe_y && event.type == "MOVE") {
			var distance = Math.abs(event.y - swipe_y);
			function exec_swipe(){
				if (event.y > swipe_y) tile.craftsSwitchFullPage(tile.data.craftsPage - 1);
				if (event.y < swipe_y) tile.craftsSwitchFullPage(tile.data.craftsPage + 1);
				tile.data.crafts_page_switched = true;
				swipe_sum = 0;
			}
			if (distance > 7) {
				exec_swipe();
			} else {
				swipe_sum += distance;
				if (swipe_sum > 15) {
					exec_swipe();
				}
			}
			swipe_y = event.y;
		} else if (swipe_y && (event.type == "UP" || event.type == "CLICK")) {
			tile.data.crafts_page_switched = false;
			swipe_y = false;
		}
		if (!moving) return;
		event.y -= content.elements["crafts_slider"].scale * 15 / 2;
		if (event.type != 'UP' && event.type != "CLICK") {
			element.window.getContentProvider().elementMap.get("crafts_slider").setPosition(content.elements['crafts_slider'].x, Math.max(Math.min(event.y, max_y), content.elements["crafts_slider"].start_y))
			tile.craftsMoveCur(event, true);
		}
		if (event.type == "UP" || event.type == "CLICK") {
			moving = false;
			tile.craftsMoveCur(event);
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
				var tile = element.window.getContainer().tileEntity;
				tile.craftsMoveCur(event);
			}
		}
	}

	_elementsGUI_craftingGrid["crafts_slider"].x -= _elementsGUI_craftingGrid["crafts_slider"].scale*10/2;
	max_y = y - 1 - _elementsGUI_craftingGrid["crafts_slider"].scale*15;
	_elementsGUI_craftingGrid.crafts_max_y = max_y;
})()

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
testButtons(craftingGridGUI.getWindow('header').getContent().elements, function(){
	grid_set_elements(360 + 109, 70, 49, 0, _elementsGUI_craftingGrid);
});

/* var __elementMap_ = craftingGridGUI.getWindow('main').getContentProvider().elementMap;
for(var i = 0; i < _elementsGUI_craftingGrid["slots_count"]; i++){
	var element = __elementMap_.get("slot"+i).getClass();
	var field = element.getDeclaredField("font");
	field.setAccessible(true);
} */

var craftsInv_elements = craftingGridGUI.getWindow('inventory').getContent();
craftsInv_elements.elements["_CLICKFRAME_"] = inv_elements.elements["_CLICKFRAME_"];

for (var izxc = 0; izxc < 4; izxc++) {
	var render = new ICRender.Model();
	var model = BlockRenderer.createTexturedBlock(getCraftingGridTexture(izxc));
	render.addEntry(model);
	BlockRenderer.enableCoordMapping(BlockID["RS_crafting_grid"], izxc, render);
}

RefinedStorage.copy(BlockID.RS_grid, BlockID.RS_crafting_grid, {
	blockInfo: {
		id: BlockID.RS_crafting_grid
	},
	craftsMoveCur: function (event, lite) {
		if (!this.container.isOpened()) return;
		if (!this.isWorkAllowed()) {
			if (this.container.isOpened() && !lite) this.craftsMoveCurToPage(0);
			return;
		}
		var content = this.container.getGuiContent();
		var max_y = content.elements["crafts_max_y"];
		var pages = this.craftsPages();
		if (pages <= 1) {
			this.container.getElement('crafts_slider').setPosition(content.elements["crafts_slider"].x, content.elements["crafts_slider"].start_y);
			return;
		}
		var interval = (max_y - content.elements["crafts_slider"].start_y) / pages;
		function __getY(i) {
			return ((interval * i) + content.elements["crafts_slider"].start_y);
		}
		var least_dec = 10001;
		var finish_i = 0;
		for (var i = 0; i <= pages; i++) {
			var dec = Math.abs(Math.round(event.y - __getY(i)));
			if (dec < least_dec) {
				least_dec = dec;
				finish_i = i;
			}
		};
		var page = finish_i;
		if (page >= pages) page = pages - 1;
		if (!lite) this.craftsMoveCurToPage(page);
		this.craftsSwitchPage(page + 1);
	},
	craftsMoveCurToPage: function (page) {
		if (!this.container.isOpened()) return;
		if (!this.isWorkAllowed()) {
			if (this.container.isOpened()) {
				var content = this.container.getGuiContent();
				this.container.getElement('crafts_slider').setPosition(content.elements["crafts_slider"].x, content.elements["crafts_slider"].start_y);
			}
			return;
		}
		var content = this.container.getGuiContent();
		var max_y = content.elements["crafts_max_y"];
		var pages = this.craftsPages();
		var interval = (max_y - content.elements["crafts_slider"].start_y) / pages;
		function __getY(i) {
			return ((interval * i) + content.elements["crafts_slider"].start_y);
		}
		if (page > pages) page = pages;
		if (page < 0) page = 0;
		this.container.getElement('crafts_slider').setPosition(content.elements["crafts_slider"].x, __getY(page));
	},
	click: function () {
		if(Entity.getSneaking(Player.get())) return false;
		this.data.textSearch = false;
		this.data.craftsTextSearch = false;
		if (this.container.isOpened()) return true;
		this.container.openAs(craftingGridGUI);
		var ths = this;
		setTimeout(function(){
			ths.items();
			ths.switchFullPage(1);
			ths.craftsSwitchPage(1);
			ths.update_slots_bitmap();
		}, 1);
		/* this.items();
		this.switchFullPage(1);
		this.craftsSwitchPage(1);
		this.update_slots_bitmap(); */
		var content = this.container.getGuiContent();
		this.data.slots_count = content.elements.slots_count;
		content.elements["image_filter"].bitmap = 'RS_filter' + (this.data.sort + 1);
		content.elements["image_filter"].x = content.elements["filter_button"].x + (content.elements["filter_button"].scale * 20 - filter_size_map[this.data.sort]) / 2;
		if (this.data.reverse_filter) {
			content.elements["image_reverse_filter"].bitmap = 'RS_arrow_up';
		} else {
			content.elements["image_reverse_filter"].bitmap = 'RS_arrow_down';
		}
		content.elements["search_text"].text = Translation.translate('Search');
		content.elements["search_text_crafts"].text = Translation.translate('Search');
		content.elements["image_redstone"].bitmap = 'redstone_GUI_' + (this.data.redstone_mode || 0);
		return true;
	},
	refreshModel: function(){
		var render = new ICRender.Model();
		var model = BlockRenderer.createTexturedBlock(getCraftingGridTexture(this.data.block_data, this.data.isActive));
		render.addEntry(model);
		BlockRenderer.mapAtCoords(this.x, this.y, this.z, render);
	},
	getCrafts: function(){
		if (!this.isWorkAllowed()) return [];
		if(!RSNetworks[this.data.NETWORK_ID].info.crafts) this.updateCrafts();
		return RSNetworks[this.data.NETWORK_ID].info.crafts;
	},
	updateCrafts: function(_cb){
		if (!this.isWorkAllowed()) return false;
		var items = this.originalItems();
		var craftsTextSearch;
		if(this.data.craftsTextSearch) craftsTextSearch = new RegExp(this.data.craftsTextSearch, "i");
		var hashSet = new java.util.HashSet();
		for(var i in items){
			WorkbenchRecipes.addRecipesThatContainItem(items[i].id, items[i].data, hashSet);
		}
		var newArray = [];
		var posArray = []
		var it = hashSet.iterator();
        while (it.hasNext()) {
			var jRecipe = it.next();
			if(craftsTextSearch){
				var result = jRecipe.getResult();
				if(!Item.getName(result.id, result.data).match(craftsTextSearch)) continue;
			}
			if(_al = this.isDarkenSlot(jRecipe)){
				newArray.push(jRecipe);
			} else if(_al != false && _al != true){
				newArray.push(jRecipe);
			} else {
				posArray.push(jRecipe);
			}
		}
		hashSet = posArray.concat(newArray);
		RSNetworks[this.data.NETWORK_ID].info.crafts = hashSet;
		return true;
	},
	craftsPages: function(){
		if (!this.isWorkAllowed()) return 1;
		var content = this.container.getGuiContent();
		var items = this.getCrafts();
		if(!items || items.length == 0) return 1;
		var _length = Math.ceil(items.length / content.elements.crafts_x_count);
		return Math.max(_length - Math.min(_length, content.elements.crafts_y_count) + 1, 0) || 1;
	},
	isDarkenSlot: function(javaRecipe){
		if(!javaRecipe) return true;
		var values = javaRecipe.getEntryCollection().iterator();
        while (values.hasNext()) {
			item = values.next();
			if(item.data == -1 ? !this.originalOnlyItemsMap()[item.id] : this.originalItemsMap().indexOf(getItemUid(item)) == -1) return true;
		}
		return false;
	},
	craftsSwitchPage: function (num) {
		if (!this.container.isOpened() || this.data.NETWORK_ID == "f") return;
		num = num || 1;
		var pages = this.craftsPages();
		if (num > pages) num = pages;
		if (num < 1) num = 1;
		var content = this.container.getGuiContent();
		var slots_count = content.elements.crafts_slots_count;
		var x_count = content.elements.crafts_x_count;
		var crafts = this.getCrafts();
		for (var i = (num - 1) * x_count; i < (num - 1) * x_count + slots_count; i++) {
			var a = i - ((num - 1) * x_count);
			var item = crafts[i] ? crafts[i].getResult() : { id: 0, data: 0, count: 0, extra: null };
			this.container.setSlot("item_craft_slot" + a, item.id, item.count, item.data > 0 ? item.data : 0, item.extra || null);
			content.elements["item_craft_slot" + a].darken = this.isDarkenSlot(crafts[i]);
		}
		this.data.craftsPage = num;
	},
	provideCraft: function(count){
		if(!this.isWorkAllowed() || !this.data.selectedRecipe || !this.data.selectedRecipe.craftable) return false;
		var netFuncs = RSNetworks[this.data.NETWORK_ID].info;
		var selectedRecipe = this.data.selectedRecipe;
		var javaRecipe = selectedRecipe.javaRecipe;
		var result = selectedRecipe.result;
		for(var i in selectedRecipe.items){
			var splited = i.split('_');
			var itemExtra = splited[2] ? ItemExtraData(Number(splited[2])) : null;
			var item = {id: Number(splited[0]), count: selectedRecipe.items[i], data: Number(splited[1]), extra: itemExtra};
			if(!netFuncs.itemCanBeDeleted(item)) return false;
		}
		var fieldApi = new WorkbenchFieldAPI(this.container);
		Callback.invokeCallback("CraftRecipePreProvided", javaRecipe, this.container);
		var fixedEntries = this.container.asScriptableField();
		var cbk = javaRecipe.getCallback();
		if(cbk)cbk.call(zhekaCompiler.assureContextForCurrentThread(), fieldApi, fixedEntries, result);
		var cbkUsed = false;
		var cbkUsedFunc = function(){
			if(cbk && !cbkUsed){
				cbkUsed = true;
				for(var i in fixedEntries){
					if(!fixedEntries[i]) continue;
					if(fixedEntries[i].count != 0){
						var answ = this.pushItem(fixedEntries[i], fixedEntries[i].count);
						if(answ != 0){
							Player.addItemToInventory(fixedEntries[i].id, answ, fixedEntries[i].data, null, false);
						}
					}
				}
			}
		};
		var refreshRecipe = false;
		for(var i in selectedRecipe.items){
			var splited = i.split('_');
			var itemExtra = splited[2] ? ItemExtraData(Number(splited[2])) : null;
			var item = {id: Number(splited[0]), count: selectedRecipe.items[i], data: Number(splited[1]), extra: itemExtra};
			netFuncs.deleteItem(item);
			if(!netFuncs.itemCanBeDeleted(item))refreshRecipe = true;
		};
		if(refreshRecipe){
			cbkUsedFunc.apply(this);
			this.post_items(true);
			this.selectRecipe(javaRecipe);
		};
		cbkUsedFunc.apply(this);
		Callback.invokeCallback("CraftRecipeProvided", javaRecipe, this.container, fieldApi.isPrevented());
		if(fieldApi.isPrevented()) return false;
		Callback.invokeCallback("VanillaWorkbenchCraft", result, this.container);
		Player.addItemToInventory(result.id, result.count, result.data == -1 ? 0 : result.data, result.extra || null);
		Callback.invokeCallback("VanillaWorkbenchPostCraft", result, this.container);
		this.data.refreshCurPage = true;
		return true;
	},
	selectRecipe: function(javaRecipe){
		if (!javaRecipe || !this.isWorkAllowed()) return false;
		var result_item = javaRecipe.getResult();
		if(!result_item) return false;
		this.container.setSlot('craft_result', result_item.id, result_item.count, result_item.data, result_item.extra || null);
		var items = javaRecipe.getSortedEntries();
		if(!items) return false;
		var smallItemsMap = {};
		var fixedItemsMap = {};
		var craftable = true;
		for(i = 0; i < 9; i++){
			if(!items[i] || !items[i].id){
				this.container.setSlot('craft_slot' + i, 0, 0, 0);
				this.container.setSlot('WB_craft_slot' + i, 0, 0, 0);
				continue;
			}
			var item = items[i];
			itemData = item.data != -1 ? item.data : ((originalItem = this.originalOnlyItemsMap()[item.id]) ? originalItem[0] : 0);
			var itemUid = item.id+'_'+itemData;
			var itemExtra = (itemExtraExist = this.originalOnlyItemsExtraMap()[itemUid]) ? itemExtraExist[0] : null;
			if(itemExtra) itemUid += '_' + itemExtra.getValue();
			if(smallItemsMap[itemUid])
				smallItemsMap[itemUid]++;
			else
				smallItemsMap[itemUid] = 1;
			itemCount = ((itemI = this.originalItemsMap().indexOf(itemUid)) != -1 && this.originalItems()[itemI].count >= smallItemsMap[itemUid]) ? 1 : 0;
			if(!itemCount) craftable = false;
			if(itemCount){
				if(fixedItemsMap[itemUid])
					fixedItemsMap[itemUid]++;
				else
					fixedItemsMap[itemUid] = 1;
			}
			this.container.setSlot('craft_slot' + i, item.id, itemCount, itemData, itemExtra);
			this.container.setSlot('WB_craft_slot' + i, item.id, itemCount, itemData, itemExtra);
		}
		this.data.selectedRecipe = {
			result: result_item,
			items: smallItemsMap,
			fixedItems: fixedItemsMap,
			javaRecipe: javaRecipe,
			craftable: craftable
		}
		Callback.invokeCallback("VanillaWorkbenchRecipeSelected", javaRecipe, javaRecipe.getResult(), this.container);
		return true;
	},
	tick: function () {
		if (this.container.isOpened() && this.data.NETWORK_ID != "f") {
			var content = this.container.getGuiContent();
			content.elements["slider_button"].bitmap = this.pages() <= 1 ? 'slider_buttonOff' : 'slider_buttonOn';
			if(this.data.refreshCurPage){
				this.refreshPageFull();
				this.data.refreshCurPage = false;
			}
			if(this.data.refreshCrafts && this.data.selectedRecipe){
				this.post_items();
				this.selectRecipe(this.data.selectedRecipe.javaRecipe);
				this.data.refreshCrafts = false;
			}
		}
		if(!this.isWorkAllowed()) return;
		if(this.data.pushDeleteEvents)for(var i in this.data.pushDeleteEvents){
			var event = this.data.pushDeleteEvents[i];
			if(!event) {
				delete this.data.pushDeleteEvents[i];
				continue;
			}
			if(event.type == 'push'){
				var item = Player.getInventorySlot(event.slot);
				if(item.id == 0) return;
				var count = Math.min(event.count, item.count);
				var pushed = this.pushItem(item, count);
				if(pushed == count){
					Player.setInventorySlot(event.slot, 0, 0, 0);
					this.refreshPageFull();
				} else if(pushed < count){
					Player.setInventorySlot(event.slot, item.id, item.count - (count - pushed), item.data, item.extra);
					this.refreshPageFull();
				}
				delete this.data.pushDeleteEvents[i];
			}
			if(event.type == 'delete'){
				var item = event.item;
				var itemMaxStack = Item.getMaxStack(item.id);
				var this_item;
				if(item && ((emptySlots = searchItem(0, -1, true)).length > 0 || ((this_item = searchItem(item.id, item.data, false, true)) && this_item.extra == item.extra && this_item.count < itemMaxStack))){
					var count = this_item && this_item.count < itemMaxStack ? Math.min(event.count, item.count, itemMaxStack - this_item.count) : Math.min(event.count, item.count, itemMaxStack*emptySlots.length);
					if((res = this.deleteItem(item, count)) < count) {
						Player.addItemToInventory(item.id, count - res, item.data, item.extra || null, false);
						this.refreshPageFull();
					}
				}
				delete this.data.pushDeleteEvents[i];
			}
		}
	},
	craftsSwitchFullPage: function (page) {
		this.craftsSwitchPage(page);
		this.craftsMoveCurToPage(page - 1);
	},
	craftsRefreshPage: function () {
		this.craftsSwitchPage(this.data.craftsPage || 1);
	},
	craftsRefreshPageFull: function () {
		this.craftsRefreshPage();
	},
	post_RefreshPageFull: function(){
		
	},
	post_items: function(_lite){
		var ths = this;
		var craftsThread = java.lang.Thread({
			run: function(){
				try {
					if(!_lite && ths.data.selectedRecipe)ths.selectRecipe(ths.data.selectedRecipe.javaRecipe);
					ths.updateCrafts();
					ths.craftsRefreshPageFull();
				} catch(err){
					alert('Sorry, i broke :_(' + JSON.stringify(err));
				}
			}
		});
		craftsThread.setPriority(java.lang.Thread.MIN_PRIORITY);
		craftsThread.start();
	},
	post_init: function () {
		for(var i = 0; i < 9; i++) delete this.container.slots['WB_craft_slot' + i];
		this.container.setWbSlotNamePrefix('WB_craft_slot');
		if(this.data.selectedRecipe){
			this.data.selectedRecipe = null;
			this.container.setSlot('craft_result', 0, 0, 0);
			for(i = 0; i < 9; i++){
				this.container.setSlot('craft_slot' + i, 0, 0, 0);
				this.container.setSlot('WB_craft_slot' + i, 0, 0, 0);
			}
		}
		/* Saver.registerObject(this.container, EMPTY_SAVER);
		Saver.setObjectIgnored(this.data.pushDeleteEvents, true);
		this.container = new UI.Container(this); */
		this.data.pushDeleteEvents = {};
	}
})