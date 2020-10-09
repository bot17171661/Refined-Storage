

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

function grid_set_elements(x, y, cons, limit, elementsGUI_grid) {

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
	elementsGUI_grid.clickFrameTouchEvents.push(function (element, event) {
		var tile = element.window.getContainer().tileEntity;
		var content = element.window.getContainer().getGuiContent();
		if (event.type == "DOWN" && !swipe_y && event.x > content.elements["x_start"] && event.x < content.elements["x_end"] && event.y > content.elements["y_start"] && event.y < content.elements["y_end"]) {
			swipe_y = event.y;
		} else if (swipe_y && event.type == "MOVE") {
			var distance = Math.abs(event.y - swipe_y);
			function exec_swipe(){
				if (event.y > swipe_y) tile.switchFullPage(tile.data.page - 1);
				if (event.y < swipe_y) tile.switchFullPage(tile.data.page + 1);
				tile.data.page_switched = true;
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
			tile.data.page_switched = false;
			swipe_y = false;
		}
		if (!moving) return;
		event.y -= content.elements["slider_button"].scale * 15 / 2;
		if (event.type != 'UP' && event.type != "CLICK") {
			element.window.getContentProvider().elementMap.get("slider_button").setPosition(content.elements['slider_button'].x, Math.max(Math.min(event.y, max_y), content.elements["slider_button"].start_y))
			tile.moveCur(event, true);
		}
		if (event.type == "UP" || event.type == "CLICK") {
			moving = false;
			tile.moveCur(event);
		}
	})

	var asd = 0;
	var x_count = Math.ceil((900 - x) / cons);
	var y_count = limit || Math.ceil((UI.getScreenHeight()- 60 - y - cons) / cons);

	elementsGUI_grid["search_frame"] = {
		type: "frame",
		x: x,
		y: 30,
		width: x_count*cons,
		height: 30,
		bitmap: "search_bar",
		scale: 0.8,
		clicker: {
			onClick: function (container, tileEntity, element) {
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
										if (!container.isOpened()) return;
										var keyword = editText.getText() + "";
										elementsGUI_grid["search_text"].text = keyword.length ? keyword : Translation.translate('Search');
										tileEntity.data.textSearch = keyword.length ? keyword : false;
										tileEntity.refreshPageFull();
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

	elementsGUI_grid["search_text"] = {
		type: "text",
		x: x + 10,
		y: 30 + 1,
		z: 100,
		text: Translation.translate('Search')/*'Search'*/,
		font: {
			color: android.graphics.Color.WHITE,
			shadow: 0.5,
			size: 20
		}
	}

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
				clicker: {
					onClick: function (param1_, param2_, param3_) {
						var tileEntity = param2_.data ? param2_ : param3_;
						if(!tileEntity || !tileEntity.data || !tileEntity.data.isActive || tileEntity.data.page_switched) return;
						var item_ident = this.num + (tileEntity.data.page - 1) * x_count;
						var items_list = tileEntity.items_list();
						if(!items_list) return;
						var item = items_list[item_ident];
						if(!item) return;
						var itemUid = getItemUid(item);
						if(tileEntity.data.pushDeleteEvents[itemUid]){
							tileEntity.data.pushDeleteEvents[itemUid] += 1;
						} else {
							tileEntity.data.pushDeleteEvents[itemUid] = {
								type: 'delete',
								count: 1,
								item: item
							}
						}
						return;
					},
					onLongClick: function (param1_, param2_, param3_) {
						var tileEntity = param2_.data ? param2_ : param3_;
						if(!tileEntity || !tileEntity.data || !tileEntity.data.isActive || tileEntity.data.page_switched) return;
						var item_ident = this.num + (tileEntity.data.page - 1) * x_count;
						var items_list = tileEntity.items_list();
						if(!items_list) return;
						var item = items_list[item_ident];
						if(!item) return;
						var itemUid = getItemUid(item);
						var itemMaxStack = Item.getMaxStack(item.id);
						if(tileEntity.data.pushDeleteEvents[itemUid]){
							tileEntity.data.pushDeleteEvents[itemUid] += itemMaxStack;
						} else {
							tileEntity.data.pushDeleteEvents[itemUid] = {
								type: 'delete',
								count: itemMaxStack,
								item: item
							}
						}
						return;
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

	var slider_frame_cons = 20;
	var slider_frame_border = 7;
	elementsGUI_grid["slider_frame"] = {
		type: "frame",
		x: _x + slider_frame_cons,
		y: y,
		width: (1000 - (_x + slider_frame_cons) - slider_frame_cons),
		height: y_count * cons,
		bitmap: "slider",
		scale: 1,
		onTouchEvent: function (element, event) {
			if (event.type == 'DOWN') {
				moving = true;
			}
			if (event.type == 'CLICK') {
				var tile = element.window.getContainer().tileEntity;
				tile.moveCur(event);
			}
		}
	}

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
		scale: Math.min((1000 - _x - slider_frame_cons * 2) / 25, (y - 30 - 10) / 15),
		clicker: {
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				var page = tileEntity.data.page;
				var pageTo = Math.max(page - 1, 1);
				tileEntity.switchPage(pageTo);
				tileEntity.moveCurToPage(pageTo - 1);
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
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
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				var pages = tileEntity.pages();
				var page = tileEntity.data.page;
				var pageTo = Math.min(page + 1, pages);
				tileEntity.switchPage(pageTo);
				tileEntity.moveCurToPage(pageTo - 1);
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
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
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				if(tileEntity.data.redstone_mode == undefined) tileEntity.data.redstone_mode = 0;
				tileEntity.data.redstone_mode = tileEntity.data.redstone_mode >= 2 ? 0 : tileEntity.data.redstone_mode + 1;
				elementsGUI_grid["image_redstone"].bitmap = 'redstone_GUI_' + tileEntity.data.redstone_mode;
				tileEntity.refreshRedstoneMode();
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
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
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				//alert('Oh ah');
				if (tileEntity.data.sort >= 2) {
					tileEntity.data.sort = 0;
				} else {
					tileEntity.data.sort++;
				}
				elementsGUI_grid["image_filter"].bitmap = 'RS_filter' + (tileEntity.data.sort + 1);
				elementsGUI_grid["image_filter"].x = elementsGUI_grid["filter_button"].x + (elementsGUI_grid["filter_button"].scale * 20 - filter_size_map[tileEntity.data.sort]) / 2;
				//temp_data[tileEntity.controller_id()].refresh = true;
				tileEntity.refreshPageFull();
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
				// если задан, задает функцию долгого нажатия
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
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				tileEntity.data.reverse_filter = !tileEntity.data.reverse_filter;
				if (tileEntity.data.reverse_filter) {
					elementsGUI_grid["image_reverse_filter"].bitmap = 'RS_arrow_up';
				} else {
					elementsGUI_grid["image_reverse_filter"].bitmap = 'RS_arrow_down';
				}
				//temp_data[tileEntity.controller_id()].refresh = true;
				tileEntity.refreshPageFull();
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
				// если задан, задает функцию долгого нажатия
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

};
var _elementsGUI_grid = {};
grid_set_elements(360, 70, 50, 0, _elementsGUI_grid);
/* testButtons(_elementsGUI_grid, function(){
	grid_set_elements(360, 70, 50, 0, _elementsGUI_grid);
}); */

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

	drawing: [/* {type: "line", x2: 1000, y1: UI.getScreenHeight()- 60 - 70 - 50, y2: UI.getScreenHeight()- 60 - 70 - 50} */],

	elements: _elementsGUI_grid
});
GUIs.push(gridGUI);

/* var __elementMap_ = gridGUI.getWindow('main').getContentProvider().elementMap;
for(var i = 0; i < _elementsGUI_grid["slots_count"]; i++){
	var element = __elementMap_.get("slot"+i).getClass();
	var field = element.getDeclaredField("font");
	field.setAccessible(true);
	//var value = field.get();
} */
//alert(!!gridGUI.getWindow('main').getContentProvider().elementMap.get('slot0').font)

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
			var tile = element.window.getContainer().tileEntity;
			if(!tile.data.isActive) return;
			var slot_id = Math.floor(event.x/251)+Math.floor(event.y/251)*4;
			var item = Player.getInventorySlot(slot_id);
			if(!item) return;
			if(item.id == 0) return;
			item.extra = item.extra || null;
			if(event.type == 'CLICK'){
				if(tile.data.pushDeleteEvents[slot_id]){
					tile.data.pushDeleteEvents[slot_id] += 1;
				} else {
					tile.data.pushDeleteEvents[slot_id] = {
						type: 'push',
						count: 1,
						slot: slot_id
					}
				}
			} else {
				var itemMaxStack = Item.getMaxStack(item.id);
				if(tile.data.pushDeleteEvents[slot_id]){
					tile.data.pushDeleteEvents[slot_id] += itemMaxStack;
				} else {
					tile.data.pushDeleteEvents[slot_id] = {
						type: 'push',
						count: itemMaxStack,
						slot: slot_id
					}
				}
			}
		}
	}
}
function least_sort(a, b) { return a - b; };

function error(message) {
	alert(message);
	return false;
}

RefinedStorage.createTile(BlockID.RS_grid, {
	defaultValues: {
		NETWORK_ID: 'f',
		LAST_NETWORK_ID: 0,
		block_data: 0,
		page: 1,
		//disk_map: {},
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
		//isActive: false/*,
		//filter_indexes: []*/
		/* 
			pushDeleteEvents: {
				"id_data_extra?": {
					type: "push" || "delete",
					count: number,
					item?: item,
					slot?: number
				}
			}
		*/
		pushDeleteEvents: {}
	},
	click: function () {
		if(Entity.getSneaking(Player.get())) return false;
		this.data.textSearch = false;
		if (this.container.isOpened()) return true;
		this.container.openAs(gridGUI);
		//alert(this.data.NETWORK_ID + ' : ' + this.data.isActive);
		var ths = this;
		setTimeout(function(){
			ths.items();
			ths.switchFullPage(1);
			ths.update_slots_bitmap();
		}, 1)
		/* this.items();
		this.switchFullPage(1);
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
		content.elements["image_redstone"].bitmap = 'redstone_GUI_' + (this.data.redstone_mode || 0);
		return true;
	},
	onWindowClose: function(){
		if(this.data.NETWORK_ID == 'f') return;
		var coords_id = this.coords_id();
		RSNetworks[this.data.NETWORK_ID][coords_id].isOpenedGrid = false;
		if((iIndex = RSNetworks[this.data.NETWORK_ID].info.openedGrids.findIndex(function(element){return cts(element) == coords_id})) != -1) RSNetworks[this.data.NETWORK_ID].info.openedGrids.splice(iIndex, 1);
	},
	onWindowOpen: function(){
		if(this.data.NETWORK_ID == 'f') return;
		var coords_id = this.coords_id();
		RSNetworks[this.data.NETWORK_ID][coords_id].isOpenedGrid = true;
		if(RSNetworks[this.data.NETWORK_ID].info.openedGrids.findIndex(function(element){return cts(element) == coords_id}) == -1) RSNetworks[this.data.NETWORK_ID].info.openedGrids.push({x: this.x, y: this.y, z: this.z});
	},
	moveCur: function (event, lite) {
		if (!this.container.isOpened()) return;
		if (!this.isWorkAllowed()) {
			if (this.container.isOpened() && !lite) this.moveCurToPage(0);
			return;
		}
		var content = this.container.getGuiContent();
		var max_y = (content.elements["slider_frame"].y + content.elements["slider_frame"].height) - 7 - content.elements["slider_button"].scale * 15;
		var pages = this.pages();
		if (pages <= 1) {
			this.container.getElement('slider_button').setPosition(content.elements["slider_button"].x, content.elements["slider_button"].start_y);
			return;
		}
		var interval = (max_y - content.elements["slider_button"].start_y) / pages;
		function __getY(i) {
			return ((interval * i) + content.elements["slider_button"].start_y);
		}
		var mas = [];
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
		if (!lite) this.moveCurToPage(page);
		this.switchPage(page + 1);
	},
	post_init: function(){
		//alert('grid init');
		/* Saver.registerObject(this.container, EMPTY_SAVER);
		Saver.setObjectIgnored(this.data.pushDeleteEvents, true);
		this.container = new UI.Container(this); */
		this.data.pushDeleteEvents = {};
	},
	moveCurToPage: function (page) {
		if (!this.container.isOpened()) return;
		if (!this.isWorkAllowed()) {
			if (this.container.isOpened()) {
				var content = this.container.getGuiContent();
				this.container.getElement('slider_button').setPosition(content.elements["slider_button"].x, content.elements["slider_button"].start_y);
			}
			return;
		}
		var content = this.container.getGuiContent();
		var max_y = (content.elements["slider_frame"].y + content.elements["slider_frame"].height) - 7 - content.elements["slider_button"].scale * 15;
		var pages = this.pages();
		var interval = (max_y - content.elements["slider_button"].start_y) / pages;
		function __getY(i) {
			return ((interval * i) + content.elements["slider_button"].start_y);
		}
		if (page > pages) page = pages;
		if (page < 0) page = 0;
		this.container.getElement('slider_button').setPosition(content.elements["slider_button"].x, __getY(page));
	},
	tick: function () {
		if (this.container.isOpened() && this.data.NETWORK_ID != "f") {
			var content = this.container.getGuiContent();
			content.elements["slider_button"].bitmap = this.pages() <= 1 ? 'slider_buttonOff' : 'slider_buttonOn';
			if(this.data.refreshCurPage){
				this.refreshPageFull();
				this.data.refreshCurPage = false;
			}
		}
		for(var i in this.data.pushDeleteEvents){
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
				alert(JSON.stringify(item) + ' : ' + count + ' : ' + pushed);
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
						alert(count + ' : ' + res);
						Player.addItemToInventory(item.id, count - res, item.data, item.extra || null, false);
						this.refreshPageFull();
					}
				}
				delete this.data.pushDeleteEvents[i];
			}
		}
	},
	post_created: function () {
		this.data.block_data = World.getBlock(this.x, this.y, this.z).data;
		/* this.container = new UI.Container();
		this.container.setParent(this); */
	},
	post_update_network: function () {
		this.data.controller_coords = searchController_net(this.data.NETWORK_ID);
		this.update_slots_bitmap();
	},
	update_slots_bitmap: function () {
		if (this.container.isOpened()) {
			var content = this.container.getGuiContent();
			var slots_count = content.elements.slots_count;
			if (this.data.NETWORK_ID == 'f' || !this.data.isActive) {
				for (var i = 0; i < slots_count; i++) {
					this.container.setSlot('slot' + i, 0, 0, 0);
					content.elements['slot' + i].bitmap = 'classic_darken_slot';
				}
				content.elements["slider_button"].bitmap = 'slider_buttonOff';
				this.switchFullPage(1);
			} else if (content.elements['slot0'].bitmap == 'classic_darken_slot') {
				for (var i = 0; i < slots_count; i++) {
					content.elements['slot' + i].bitmap = 'classic_slot';
				}
				this.switchFullPage(1);
			}
		}
	},
	post_setActive: function(){
		this.items();
		this.update_slots_bitmap();
	},
	controller_id: function () {
		if (this.data.NETWORK_ID == "f") return '0,0,0';
		return this.data.controller_coords.x + ',' + this.data.controller_coords.y + ',' + this.data.controller_coords.z;
	},
	pages: function () {
		if (this.container.isOpened() && this.data.NETWORK_ID != "f") {
			var content = this.container.getGuiContent();
			var items = this.items_list();//this.items()//temp_data[this.controller_id()].items;
			if(!items) return 1;
			//if (this.data.textSearch) items = items;//items = temp_data[this.controller_id()].filtered_items;
			//return Math.ceil(temp_data[this.controller_id()].items.length / content.elements.slots_count) || 1;
			var _length = Math.ceil(items.length / content.elements.x_count);
			return Math.max(_length - Math.min(_length, content.elements.y_count) + 1, 0) || 1;
		} else {
			return 1;
		}
	},
	items_list: function(_var){
		if(_var != undefined){
			temp_data[this.coords_id()] = _var;
		} else {
			return temp_data[this.coords_id()];
		}
	},
	items: function () {
		if (!this.isWorkAllowed()) {
			this.items_list([]);
			return [];
		}
		var items = RSNetworks[this.data.NETWORK_ID].info.items;
		if(this.data.textSearch)var textSearch = new RegExp(this.data.textSearch, "i");
		items = this.data.textSearch ? items.filter(function (value, index) {
			if(!value.name){
				//alert('error! ' + JSON.stringify(value));
				return false
			}
			if (value.name.match(textSearch)) {
				//filter_indexes.push(index);
				return true;
			}
		}, this) : items.slice();
		items.sort(this.sort(this.data.sort));
		this.items_list(items);
		if(this.post_items)this.post_items();
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
			return [];
		}
		return RSNetworks[this.data.NETWORK_ID].info.just_items_map;
	},
	originalOnlyItemsExtraMap: function(){
		if (!this.isWorkAllowed()) {
			return [];
		}
		return RSNetworks[this.data.NETWORK_ID].info.just_items_map_extra;
	},
	pushItem: function (item, count) {
		count = count || item.count;
		if (!this.isWorkAllowed()) return count;
		var res = RSNetworks[this.data.NETWORK_ID].info.pushItem(item, count);
		if(this.post_pushItem)this.post_pushItem(item, count, res);
		return res;
	},
	deleteItem: function (item, count) {
		count = count || item.count;
		if (!this.isWorkAllowed()) return count;
		var res = RSNetworks[this.data.NETWORK_ID].info.deleteItem(item, count);
		if(this.post_deleteItem)this.post_deleteItem(item, count, res);
		return res;
	},
	addItem: function (item, count) {
		//if (this.data.NETWORK_ID == "f") return false;
	},
	switchPage: function (num) {
		if (!this.container.isOpened() || !this.isWorkAllowed()) return;
		num = num || 1;
		var pages = this.pages();
		if (num > pages) num = pages;
		if (num < 1) num = 1;
		var container = this.container;
		var content = this.container.getGuiContent();
		var slots_count = content.elements.slots_count;
		var x_count = content.elements.x_count;
		//var y_count = content.elements.y_count;
		var items = this.items_list() || [];
		for (var i = (num - 1) * x_count; i < (num - 1) * x_count + slots_count; i++) {
			var a = i - ((num - 1) * x_count);
			var item = items[i] || { id: 0, data: 0, count: 0, extra: null };
			container.setSlot("slot" + a, item.id, item.count, item.data, item.extra || null);
		}
		this.data.page = num;
	},
	switchFullPage: function (page) {
		this.switchPage(page);
		this.moveCurToPage(page - 1);
	},
	refreshPage: function () {
		this.switchPage(this.data.page);
	},
	refreshPageFull: function () {
		this.items();
		this.refreshPage();
		this.moveCurToPage(this.data.page - 1);
		if(this.post_RefreshPageFull)this.post_RefreshPageFull();
	},
	post_destroy: function () {
		delete temp_data[this.coords_id()];
		this.container.slots = {};
	},
	sort: function (type) {
		if (this.data.reverse_filter) {
			if (type == 2) {
				return function (a, b) { return b.id - a.id };
			} else if (type == 0) {
				return function (a, b) { return a.count - b.count };
			} else if (type == 1) {
				return function (a, b) {
					if (b.name > a.name) {
						return 1;
					}
					if (b.name < a.name) {
						return -1;
					}
					return 0;
				};
			}
		} else {
			if (type == 2) {
				return function (a, b) { return a.id - b.id };
			} else if (type == 0) {
				return function (a, b) { return b.count - a.count };
			} else if (type == 1) {
				return function (a, b) {
					if (a.name > b.name) {
						return 1;
					}
					if (a.name < b.name) {
						return -1;
					}
					return 0;
				};
			}
		}
	},
	refreshModel: function(){
		var render = new ICRender.Model();
		//alert(this.data.block_data);
		var model = BlockRenderer.createTexturedBlock(getGridTexture(this.data.block_data, this.data.isActive));
		render.addEntry(model);
		BlockRenderer.mapAtCoords(this.x, this.y, this.z, render);
	}
})