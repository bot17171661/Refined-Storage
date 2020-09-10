IDRegistry.genBlockID("RS_controller");
RefinedStorage.createMapBlock("RS_controller", [
	{
		name: "Controller",
		texture: [
			["controller_off", 0]
		],
		inCreative: true
	},
	{
		name: "Controller",
		texture: [
			["controller_nearly_off", 0]
		],
		inCreative: false
	},
	{
		name: "Controller",
		texture: [
			["controller_on", 0]
		],
		inCreative: false
	},
	{
		name: "Creative Controller",
		texture: [
			["controller_on", 0]
		],
		inCreative: false
	}
]);
mod_tip(BlockID['RS_controller']);
RS_blocks.push(BlockID.RS_controller);
ICRender.getGroup("ic-wire").add(BlockID.RS_controller, -1);

var Controller_2_extra = new ItemExtraData();
Controller_2_extra.putInt('energy', Config.controller.energyCapacity);
Item.addToCreative(BlockID['RS_controller'], 1, 2, Controller_2_extra);
Item.addToCreative(BlockID['RS_controller'], 1, 3);

Item.registerNameOverrideFunction(BlockID['RS_controller'], function (item, name) {
	if(item.data == 3) return name;
	if (!item.extra) return name + '\n§70 / ' + Config.controller.energyCapacity;
	var energy = item.extra.getInt('energy', 0);
	return name + '\n§7' + energy + ' / ' + Config.controller.energyCapacity;
})

Item.registerIconOverrideFunction(BlockID['RS_controller'], function(item, isModUi){
	if(isModUi){
		if(item.data == 1){
			return {name:'controllerTempOff', data: World.getThreadTime()%12};
		} else if(item.data == 2 || item.data == 3){
			return {name:'controllerTempOn', data: parseInt(World.getThreadTime()%24/2)};
		}
	}
})

Block.registerDropFunction("RS_controller", function (coords, id, data, diggingLevel, toolLevel) {
	return [];
});

Block.registerPlaceFunction("RS_controller", function (coords, item, block) {
	coords = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
	var relBlock = World.getBlock(coords.x, coords.y, coords.z);
	if (relBlock.id != 0 && relBlock.id != 9 && relBlock.id != 11) return;
	World.setBlock(coords.x, coords.y, coords.z, item.id, item.data);
	var tile = World.addTileEntity(coords.x, coords.y, coords.z) || World.getTileEntity(coords.x, coords.y, coords.z);
	var energy = 0;
	if(item.data == 3 && tile && tile.data){
		tile.data.isCreative = true;
		tile.data.energy = Config.controller.energyCapacity;
		//tile.setActive(true);
		return;
	}
	if (item.extra && item.extra.getInt('energy') && tile && tile.data) {
		energy = item.extra.getInt('energy');
		tile.data.energy = energy;
	}
});
var elementsGUI_controller = {};
var controller_other_data = {};
function initControllerElements() {
	var moving = false;
	var swipe_y;
	var swipe_sum = 0;
	var max_y = 0;
	elementsGUI_controller["click_frame"] = {
		type: "frame",
		x: -100,
		y: -100,
		z: -100,
		width: 1200,
		height: UI.getScreenHeight() + 200,
		bitmap: "empty",
		scale: 1,
		onTouchEvent: function (element, event) {
			var tile = element.window.getContainer().tileEntity;
			var content = element.window.getContainer().getGuiContent();
			if (event.type == "DOWN" && !swipe_y && event.x > content.elements["mesh"].x && event.x < (content.elements["mesh"].x + content.elements["mesh"].width) && event.y > content.elements["mesh"].y && event.y < (content.elements["mesh"].y + content.elements["mesh"].height)) {
				swipe_y = event.y;
			} else if (swipe_y && event.type == "MOVE") {
				var distance = Math.sqrt(Math.pow(event.y - swipe_y, 2));
				if (distance > 7) {
					if (event.y > swipe_y) tile.switchFullPage(tile.data.page - 1);
					if (event.y < swipe_y) tile.switchFullPage(tile.data.page + 1);
					tile.data.page_switched = true;
					swipe_sum = 0;
				} else {
					swipe_sum += distance;
					if (swipe_sum > 15) {
						if (event.y > swipe_y) tile.switchFullPage(tile.data.page - 1);
						if (event.y < swipe_y) tile.switchFullPage(tile.data.page + 1);
						tile.data.page_switched = true;
						swipe_sum = 0;
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
				content.elements['slider_button'].y = Math.max(Math.min(event.y, max_y), content.elements["slider_button"].start_y);
				tile.moveCur(event, true);
			}
			if (event.type == "UP" || event.type == "CLICK") {
				moving = false;
				tile.moveCur(event);
			}
		}
	}

	var y = 110;
	var percents = 0.5;

	elementsGUI_controller["scale"] = {
		type: "scale",
		x: 50,
		y: y,
		direction: 1,
		bitmap: "storage_scale_full",
		overlay: "storage_scale_empty",
		value: 0,
		scale: Math.min(UI.getScreenHeight()*percents/72, 4.5),
		overlayScale: 0
	};
	elementsGUI_controller["scale"].overlayScale = elementsGUI_controller["scale"].scale;
	elementsGUI_controller['usage'] = {
		type: "text",
		x: 50,
		y: elementsGUI_controller["scale"].y - 40,
		text: Translation.translate('Usage')+": 0 FE/t",
		font: {
			color: android.graphics.Color.WHITE,
			shadow: 0.5,
			size: 20
		}
	}
	elementsGUI_controller['storage'] = {
		type: "text",
		x: 50,
		y: elementsGUI_controller["scale"].y + elementsGUI_controller["scale"].scale*72 + 20,
		text: "0/0 FE",
		font: {
			color: android.graphics.Color.WHITE,
			shadow: 0.5,
			size: 18
		}
	}
	elementsGUI_controller['mesh'] = {
		type: "image", 
		x: 0, 
		y: y,
		scale: elementsGUI_controller["scale"].scale*72/61,
		bitmap: "controllerMesh"
	}
	elementsGUI_controller['mesh'].x = 900 - elementsGUI_controller['mesh'].scale*123;
	
	elementsGUI_controller['mesh'].height = elementsGUI_controller['mesh'].scale*61;
	elementsGUI_controller['mesh'].width = elementsGUI_controller['mesh'].scale*123;

	var mesh_width = Math.floor(elementsGUI_controller['mesh'].width);
	var mesh_height = Math.floor(elementsGUI_controller['mesh'].height);
	var slot_padding = mesh_height/2*0.1;
	var slot_size = (mesh_height/2-slot_padding*2)*0.6;
	var asd = 0;
	for(var h = elementsGUI_controller['mesh'].y; h < elementsGUI_controller['mesh'].y + mesh_height; h += mesh_height/2){
		for(var w = elementsGUI_controller['mesh'].x; w < elementsGUI_controller['mesh'].x + mesh_width; w += mesh_width/2){
			elementsGUI_controller['block_info' + asd] = {
				type: "text",
				num: asd,
				x: w + slot_padding,
				y: h + slot_padding/2 + ((mesh_height/2-slot_padding*2)*0.4)/2,
				z: 10,
				text: "This is block " + mesh_width + ' : ' + mesh_height,
				font: {
					color: android.graphics.Color.DKGRAY,
					shadow: 0.15,
					size: Math.ceil((mesh_height/2-slot_padding*2)*0.2)
				}
			}
			elementsGUI_controller['block_info' + asd].y -= elementsGUI_controller['block_info' + asd].font.size/2
			elementsGUI_controller['block_count' + asd] = {
				type: "text",
				num: asd,
				x: w + slot_padding*2 + slot_size,
				y: h + (mesh_height/2 - slot_padding - slot_size/2),
				z: 10,
				text: "1x",
				font: {
					color: android.graphics.Color.DKGRAY,
					shadow: 0.15,
					size: Math.ceil(slot_size*0.25)
				}
			}
			elementsGUI_controller['block_count' + asd].y -= elementsGUI_controller['block_count' + asd].font.size/2
			elementsGUI_controller['block_energy_use' + asd] = {
				type: "text",
				num: asd,
				x: w + slot_padding*2 + slot_size*2,
				y: h + (mesh_height/2 - slot_padding - slot_size/2),
				z: 10,
				text: "0 FE/t",
				font: {
					color: android.graphics.Color.DKGRAY,
					shadow: 0.15,
					size: Math.ceil(slot_size*0.3)
				}
			}
			elementsGUI_controller['block_energy_use' + asd].y -= elementsGUI_controller['block_energy_use' + asd].font.size/2
			elementsGUI_controller['slot' + asd] = {
				type: "slot",
				num: asd,
				x: w + slot_padding,
				y: h + (mesh_height/2 - slot_padding - slot_size),
				z: 10,
				bitmap: "empty",
				isTransparentBackground: true,
				needClean: true,
				clicker: {
					onClick: function (position, container, tileEntity, window, canvas, scale) {
					},
					onLongClick: function (position, container, tileEntity, window, canvas, scale) {
						
					}
				},
				size: Math.ceil(slot_size)
			}
			asd++;
		}
	}
	controller_other_data['max_sym'] = Math.round((mesh_width/2 - slot_padding*2)/(elementsGUI_controller['block_info0'].font.size*(5/7)));

	var slider_frame_cons = 25;
	var slider_frame_border = 7;
	elementsGUI_controller["slider_frame"] = {
		type: "frame",
		x: 900 + slider_frame_cons,
		y: y,
		width: (1000 - (900 + slider_frame_cons) - slider_frame_cons),
		height: elementsGUI_controller["scale"].scale*72,
		bitmap: "slider",
		scale: 1,
		onTouchEvent: function (element, event) {
			var tile = element.window.getContainer().tileEntity;
			if (event.type == 'DOWN') {
				moving = true;
			}
			if (event.type == 'CLICK') {
				tile.moveCur(event);
			}
		}
	}

	elementsGUI_controller["slider_button"] = {
		type: "button",
		x: elementsGUI_controller["slider_frame"].x + slider_frame_border,
		start_y: elementsGUI_controller["slider_frame"].y + slider_frame_border,
		y: elementsGUI_controller["slider_frame"].y + slider_frame_border,
		z: 10,
		bitmap: 'slider_buttonOff',
		scale: (elementsGUI_controller["slider_frame"].width - slider_frame_border * 2) / 12
	}
	max_y = (elementsGUI_controller["slider_frame"].y + elementsGUI_controller["slider_frame"].height) - 7 - elementsGUI_controller["slider_button"].scale * 15;
	var settings_cons = 10;
	elementsGUI_controller["redstone_button"] = {
		type: "button",
		x: 0,
		y: elementsGUI_controller['mesh'].y,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale: mesh_height*0.17/20,
		clicker: {
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				if(tileEntity.data.redstone_mode == undefined) tileEntity.data.redstone_mode = 0;
				tileEntity.data.redstone_mode = tileEntity.data.redstone_mode >= 2 ? 0 : tileEntity.data.redstone_mode + 1;
				elementsGUI_controller["image_redstone"].bitmap = 'redstone_GUI_' + tileEntity.data.redstone_mode;
				tileEntity.refreshRedstoneMode();
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
			}
		}
	}
	elementsGUI_controller["redstone_button"].x = elementsGUI_controller['mesh'].x - settings_cons - (20 * elementsGUI_controller["redstone_button"].scale);

	elementsGUI_controller["image_redstone"] = {
		type: "image",
		x: elementsGUI_controller["redstone_button"].x,
		y: elementsGUI_controller["redstone_button"].y,
		z: 1000,
		bitmap: "redstone_GUI_0",
		scale: elementsGUI_controller["redstone_button"].scale*20/16,
	}
};
initControllerElements();
testButtons(elementsGUI_controller, initControllerElements);

const CONTROLLER_GUI = new UI.StandartWindow({
	standart: {
		header: {
			text: {
				text: Translation.translate("Controller")
			}
		},
		background: {
			standart: true
		}
	},

	drawing: [],

	elements: elementsGUI_controller
});
GUIs.push(CONTROLLER_GUI);
RefinedStorage.createTile(BlockID.RS_controller, {
	defaultValues: {
		NETWORK_ID: "f",
		energy: 0,
		usage: 0,
		lastTexture: '',
		page_switched: false,
		//isActive: null,
		activePost: false,
		net_map: {},
		page: 1,
		redstone_mode: 0,
		isCreative: false
	},
	created: function () {
		while (controller = searchController(this)) {
			for (var i in sides) {
				var coordss = {};
				coordss.x = this.x + sides[i][0];
				coordss.y = this.y + sides[i][1];
				coordss.z = this.z + sides[i][2];
				var bck = World.getBlock(coordss.x, coordss.y, coordss.z);
				if (RS_blocks.indexOf(bck.id) != -1) {
					if(bck.id == BlockID.RS_cable){
						for(var i in Network){
							if(Network[i][cts(coordss)]){
								delete Network[i][cts(coordss)];
								World.destroyBlock(coordss.x, coordss.y, coordss.z, true);
							}
						}
					} else {
						var tile = World.getTileEntity(coordss.x, coordss.y, coordss.z);
						if (tile && tile.data.NETWORK_ID != 'f' && tile.data.NETWORK_ID != this.data.NETWORK_ID) {
							World.destroyBlock(coordss.x, coordss.y, coordss.z, true);
						}
					}
				}
			}
		}
	},
	setActive: function(state, forced){
		state = !!state;
		if(this.data.isActive == state) return;
		if (this.pre_setActive) if(this.pre_setActive(state)) return;
		if(state && !this.redstoneAllowActive(this.data.last_redstone_event)) return;
		if(state == false || (forced || this.data.allowSetIsActive != false)){
			this.data.isActive = state;
			if(this.data.NETWORK_ID != "f")Network[this.data.NETWORK_ID][this.coords_id()].isActive = state
		}
		this.refreshModel();
		if (this.post_setActive) this.post_setActive(state);
		this.refreshPageFull();
	},
	init: function () {
		if (this.data.NETWORK_ID == "f" || !Network[this.data.NETWORK_ID]) {
			this.data.NETWORK_ID = Network.length;
			var _data = {};
			_data[cts(this)] = {
				id: BlockID.RS_controller,
				coords: { x: this.x, y: this.y, z: this.z },
				isActive: false
			}
			_data['info'] = {
				net_id: Network.length,
				//disk_items_map: {},
				disk_map: [],
				just_items_map: {},
				just_items_map_extra: {},
				items_map: [],
				items: [],
				openedGrids: [],
				storage: 0,
				stored: 0,
				refreshOpenedGrids: function(){
					for(var i in this.openedGrids){
						var __coords = this.openedGrids[i];
						var tile = World.getTileEntity(__coords.x, __coords.y, __coords.z);
						tile.data.refreshCurPage = true;
					}
				},
				updateItems: function(){
					var diskDrives = searchBlocksInNetwork(this.net_id, BlockID['diskDrive']);
					var disk_map = [];
					var items_map = [];
					var items = [];
					var storage = 0;
					var stored = 0;
					var just_items_map = {};
					var just_items_map_extra = {};
					//var disk_items_map = {};
					for(var i in diskDrives){
						var tile = World.getTileEntity(diskDrives[i].coords.x, diskDrives[i].coords.y, diskDrives[i].coords.z);
						if(!tile || !tile.data.isActive) continue;
						var newDiskData = [];
						//newDiskData.id = cts(diskDrives[i].coords);
						for (var k = 0; k < 8; k++) {
							var item = tile.container.getSlot('slot' + k);
							if (!Disk.items[item.id]) continue;
							if (item.data == 0) item.data = DiskData.length;
							var disk_data = Disk.getDiskData(item);
							//alert(JSON.stringify(disk_data));
							storage += disk_data.storage;
							stored += disk_data.items_stored;
							for(var s in disk_data.items){
								var diskItem = disk_data.items[s];
								var itemUid = getItemUid(diskItem);
								if((index = items_map.indexOf(itemUid)) != -1){
									items[index].count += diskItem.count;
								} else {
									items.push(Object.assign({}, diskItem));
									items_map.push(itemUid);
								}
								if(just_items_map[diskItem.id] && just_items_map[diskItem.id].indexOf(diskItem.data) == -1){
									just_items_map[diskItem.id].push(diskItem.data);
								} else if(!just_items_map[diskItem.id]){
									just_items_map[diskItem.id] = [diskItem.data];
								}
								if(diskItem.extra){
									if(just_items_map_extra[diskItem.id+'_'+diskItem.data] && just_items_map_extra[diskItem.id+'_'+diskItem.data].indexOf(diskItem.extra) == -1){
										just_items_map_extra[diskItem.id+'_'+diskItem.data].push(diskItem.extra);
									} else if(!just_items_map_extra[diskItem.id+'_'+diskItem.data]){
										just_items_map_extra[diskItem.id+'_'+diskItem.data] = [diskItem.extra];
									}
								}
							}
							newDiskData.push(disk_data);
						}
						if(newDiskData.length == 0) continue;
						disk_map.push(newDiskData);
					}
					this.disk_map = disk_map;
					this.items_map = items_map;
					this.items = items;
					this.storage = storage;
					this.stored = stored;
					this.just_items_map = just_items_map;
					this.just_items_map_extra = just_items_map_extra;
					this.refreshOpenedGrids();
					//this.disk_items_map = disk_items_map;
				},
				itemCanBePushed: function(item, count){
					return Math.min(this.storage - this.stored, count || item.count);
				},
				pushItem: function(item, count){
					count = count || item.count;
					if(!this.itemCanBePushed(item, count)) return count;
					var itemUid = getItemUid(item);
					//var count1 = Math.min(count, this.storage - this.stored);
					/* if((itemsDisks = this.disk_items_map[itemUid]) && ((index = this.items_map.indexOf(itemUid)) != -1)){
						for(var i in itemsDisks){
							if(itemsDisks[i][1].items_stored >= itemsDisks[i][1].storage) continue;
							var freeSpace = itemsDisks[i][1].storage - itemsDisks[i][1].items_stored;
							if(count >= freeSpace){
								count -= freeSpace;
								this.items[index].count += freeSpace;
								this.stored += freeSpace;
								itemsDisks[i][1].items_stored += freeSpace;
								itemsDisks[i][0].count += freeSpace;
							} else {
								this.items[index].count += count;
								this.stored += count;
								itemsDisks[i][1].items_stored += count;
								itemsDisks[i][0].count += count;
								return 0;
							}
						}
					} else {
						if(!item.name)item.name = Item.getName(item.id, item.data);
						this.items.push({
							id: item.id,
							data: item.data,
							count: Math.min(count, this.storage - this.stored),
							extra: item.extra,
							name: item.name
						});
						this.items_map.push(itemUid);
						if(this.just_items_map[item.id] && this.just_items_map[item.id].indexOf(item.data) == -1){
							this.just_items_map[item.id].push(item.data);
						} else if(!this.just_items_map[item.id]){
							this.just_items_map[item.id] = [item.data];
						}
					}
					//this.stored += count1;
					for(var i in this.disk_map){
						for(var k in this.disk_map[i]){
							if(count == 0 || this.storage - this.stored == 0) return count;
							if(!this.disk_map[i][k]) continue;
							var freeSpace = this.disk_map[i][k].storage - this.disk_map[i][k].items_stored;
							if(freeSpace == 0) continue;
							if(count >= freeSpace){
								count -= freeSpace;
								this.stored += freeSpace;
								this.disk_map[i][k].items[itemUid] = {
									id: item.id,
									data: item.data,
									count: freeSpace,
									extra: item.extra,
									name: item.name
								}
								this.disk_map[i][k].items_stored += freeSpace;
								this.disk_items_map[itemUid].push(this.disk_map[i][k].items[itemUid], this.disk_map[i][k]);
							} else {
								this.stored += count;
								this.disk_map[i][k].items[itemUid] = {
									id: item.id,
									data: item.data,
									count: count,
									extra: item.extra,
									name: item.name
								}
								this.disk_map[i][k].items_stored += count;
								this.disk_items_map[itemUid].push(this.disk_map[i][k].items[itemUid], this.disk_map[i][k]);
								return 0;
							}
						}
					}
					return count; */
					if((index = this.items_map.indexOf(itemUid)) != -1){
						for(var i in this.disk_map){
							for(var k in this.disk_map[i]){
								if(count == 0 || this.storage - this.stored == 0){
									this.refreshOpenedGrids();
									return count;
								};
								if(disk_item = this.disk_map[i][k].items[itemUid]){
									var freeSpace = this.disk_map[i][k].storage - this.disk_map[i][k].items_stored;
									if(freeSpace == 0) continue;
									if(count >= freeSpace){
										count -= freeSpace;
										this.items[index].count += freeSpace;
										this.stored += freeSpace;
										this.disk_map[i][k].items_stored += freeSpace;
										disk_item.count += freeSpace;
									} else {
										this.items[index].count += count;
										this.stored += count;
										this.disk_map[i][k].items_stored += count;
										disk_item.count += count;
										this.refreshOpenedGrids();
										return 0;
									}
								};
							}
						}
					} else {
						if(!item.name)item.name = Item.getName(item.id, item.data);
						this.items.push({
							id: item.id,
							data: item.data,
							count: Math.min(count, this.storage - this.stored),
							extra: item.extra,
							name: item.name
						});
						this.items_map.push(itemUid);
						if(this.just_items_map[item.id] && this.just_items_map[item.id].indexOf(item.data) == -1){
							this.just_items_map[item.id].push(item.data);
						} else if(!this.just_items_map[item.id]){
							this.just_items_map[item.id] = [item.data];
						}
						if(item.extra){
							itemUidExtra = item.id+'_'+item.data;
							if(this.just_items_map_extra[itemUidExtra] && this.just_items_map_extra[itemUidExtra].indexOf(item.extra) == -1){
								this.just_items_map_extra[itemUidExtra].push(item.extra);
							} else if(!this.just_items_map_extra[itemUidExtra]){
								this.just_items_map_extra[itemUidExtra] = [item.extra];
							}
						}
					}
					if(!item.name)item.name = Item.getName(item.id, item.data);
					//this.stored += count1;
					for(var i in this.disk_map){
						for(var k in this.disk_map[i]){
							if(count == 0 || this.storage - this.stored == 0) {
								this.refreshOpenedGrids();
								return count;
							}
							if(!this.disk_map[i][k]) continue;
							var freeSpace = this.disk_map[i][k].storage - this.disk_map[i][k].items_stored;
							if(freeSpace == 0) continue;
							if(count >= freeSpace){
								count -= freeSpace;
								this.stored += freeSpace;
								this.disk_map[i][k].items[itemUid] = {
									id: item.id,
									data: item.data,
									count: freeSpace,
									extra: item.extra,
									name: item.name
								}
								this.disk_map[i][k].items_stored += freeSpace;
							} else {
								this.stored += count;
								this.disk_map[i][k].items[itemUid] = {
									id: item.id,
									data: item.data,
									count: count,
									extra: item.extra,
									name: item.name
								}
								this.disk_map[i][k].items_stored += count;
								this.refreshOpenedGrids();
								return 0;
							}
						}
					};
					//}
					this.refreshOpenedGrids();
				},
				itemCanBeDeleted: function(item, count){
					count = count || item.count;
					if(count > this.stored) return false;
					var itemUid = getItemUid(item);
					if((iItem = this.items_map.indexOf(itemUid)) != -1 && this.items[iItem].count >= count){
						return true;
					} else {
						return false;
					}
				},
				deleteItem: function(item, count){
					count = count || item.count;
					if(this.stored == 0) return count;
					var itemUid = getItemUid(item);
					var count1 = Math.min(count, this.stored);
					if((num = this.items_map.indexOf(itemUid)) != -1){
						if(count >= this.items[num].count){
							this.items_map.splice(num, 1);
							this.items.splice(num, 1);
							if(this.just_items_map[item.id] && (justIMap = this.just_items_map[item.id].indexOf(item.data)) != -1)this.just_items_map[item.id].splice(justIMap, 1);
							if(this.just_items_map[item.id] && this.just_items_map[item.id].length == 0)delete this.just_items_map[item.id];
							if(item.extra){
								itemUidExtra = item.id+'_'+item.data;
								if(this.just_items_map_extra[itemUidExtra] && (justIMap = this.just_items_map_extra[itemUidExtra].indexOf(item.extra) != -1)) this.just_items_map_extra[itemUidExtra].splice(justIMap, 1);
								if(this.just_items_map_extra[itemUidExtra] && this.just_items_map_extra[itemUidExtra].length == 0) delete this.just_items_map_extra[itemUidExtra];
							}
							for(var i in this.disk_map){
								for(var k in this.disk_map[i]){
									if(!this.disk_map[i][k] || !this.disk_map[i][k].items) continue;
									if(disk_item = this.disk_map[i][k].items[itemUid]) {
										this.stored -= disk_item.count;
										this.disk_map[i][k].items_stored -= disk_item.count;
										delete this.disk_map[i][k].items[itemUid];
										this.refreshOpenedGrids();
										return 0;
									}
								}
							}
						} else {
							this.items[num].count -= count1;
							for(var i in this.disk_map){
								for(var k in this.disk_map[i]){
									if(count == 0 || this.stored == 0) {
										this.refreshOpenedGrids();
										return count;
									};
									if(!this.disk_map[i][k] || !this.disk_map[i][k].items) continue;
									if(disk_item = this.disk_map[i][k].items[itemUid]){
										if(count >= disk_item.count){
											count -= disk_item.count;
											this.stored -= disk_item.count;
											this.disk_map[i][k].items_stored -= disk_item.count;
											delete this.disk_map[i][k].items[itemUid];
										} else {
											this.stored -= count;
											this.disk_map[i][k].items_stored -= count;
											disk_item.count -= count;
											this.refreshOpenedGrids();
											return 0;
										}
									};
								}
							}
							this.refreshOpenedGrids();
							return count;
						}
					} else {
						alert('Hey, are you doing something wrong');
					}
					this.refreshOpenedGrids();
				}
			}
			Network.push(_data);
			var ths = this;
			setTimeout(function(){
				_data['info'].updateItems();
				ths.updateControllerNetwork(true);
				ths.updateNetMap();
				ths.setActive(ths.data.energy > ths.data.usage);
				ths.refreshModel();
			},1)
		}
	},
	updateItems: function(){
		if(this.data.NETWORK_ID != 'f'){
			Network[this.data.NETWORK_ID].info.updateItems();
		}
	},
	updateControllerNetwork: function(_first){
		//alert('Controller network update');
		set_net_for_blocks(this, this.data.NETWORK_ID, false, _first, this.data.isActive/* , function(coords, block){
			if(block.id == BlockID.RS_controller/*  && cts(this) != cts(coords) ){
				alert('WIY WIY WIY WIY');
				World.destroyBlock(coords.x, coords.y, coords.z, true);
				return true;
			}
		} */);
		//set_is_active_for_blocks_net(this.data.NETWORK_ID, this.data.isActive, true);
	},
	getEnergyScaled: function (scale) {
		return Math.floor(this.data.energy / Config.controller.energyCapacity * scale);
	},
	getNewTexture: function (energyScaled) {
		if (energyScaled <= 0 || !this.data.isActive) {
			return 'controller_off';
		} else if (energyScaled <= 20) {
			return 'controller_nearly_off';
		}
		return 'controller_on';
	},
	click: function () {
		if(Entity.getSneaking(Player.get())) return false;
		if (this.container.isOpened()) return true;
		CONTROLLER_GUI.getWindow('header').getContent().drawing[2].text = this.data.isCreative ? Translation.translate("Creative Controller") : Translation.translate("Controller");
		this.container.openAs(CONTROLLER_GUI);
		var content = this.container.getGuiContent();
		this.container.setScale('scale', this.data.energy / this.getCapacity());
		this.container.setText('usage', Translation.translate('Usage')+": " + this.data.usage + " FE/t");
		this.container.setText('storage', this.data.energy + '/' + this.getCapacity() + ' FE');
		content.elements["image_redstone"].bitmap = 'redstone_GUI_' + (this.data.redstone_mode || 0);
		//alert(JSON.stringify(content));
		//content.standart.header.text.text = this.data.isCreative ? Translation.translate("Creative Controller") : Translation.translate("Controller");
		this.switchFullPage(1);
		return true;
	},
	post_setActive: function(state){
		//alert(state);
		if(!state){
			this.data.net_map = {};
			this.data.usage = 0;
			this.container.setText('usage', Translation.translate('Usage') + ": 0 FE/t");
		} else {
			this.updateNetMap();
		}
		//alert(state);
		set_is_active_for_blocks_net(this.data.NETWORK_ID, state, true);
	},
	moveCur: function(event, lite){
		if (!this.container.isOpened()) return;
		if (!this.isWorkAllowed()) {
			if (this.container.isOpened() && !lite) this.moveCurToPage(0);
			return;
		}
		var content = this.container.getGuiContent();
		var max_y = (content.elements["slider_frame"].y + content.elements["slider_frame"].height) - 7 - content.elements["slider_button"].scale * 15;
		var pages = this.pages();
		//alert(pages);
		if (pages <= 1) {
			content.elements["slider_button"].y = content.elements["slider_button"].start_y;
			//this.switchPage(this.data.page);
			//alert('pages = 0');
			return;
		}
		var interval = (max_y - content.elements["slider_button"].start_y) / pages;
		function __getY(i) {
			return ((interval * i) + content.elements["slider_button"].start_y);
		}
		//var mas = [];
		var least_dec = 10001;
		var finish_i = 0;
		for (var i = 0; i <= pages; i++) {
			//mas.push(Math.abs(Math.round(event.y - __getY(i))));
			var dec = Math.abs(Math.round(event.y - __getY(i)));
			if (dec < least_dec) {
				least_dec = dec;
				finish_i = i;
			}
			//content.drawing[i] = { type: "line", x1: content.elements["slider_frame"].x - 10, y1: __getY(i), x2: content.elements["slider_frame"].x + content.elements["slider_frame"].width + 10, y2: __getY(i) }
		};
		//var mas2 = mas.concat([]);
		//mas.sort(least_sort);
		var page = finish_i;//mas2.indexOf(mas[0]);
		//devLog(mas2 + ' | ' + mas + ' | ' + page + ' | ' + pages + ' | ' + interval + ' | ' + this.items().length);
		//alert(max_y)
		//for (var i = 0; i < pages; i++)alert(__getY(i));
		if (page >= pages) page = pages - 1;
		if (!lite) this.moveCurToPage(page);
		this.switchPage(page + 1);
	},
	pages: function () {
		if (this.container.isOpened() && this.data.NETWORK_ID != "f" && this.data.isActive) {
			//var content = this.container.getGuiContent();
			var aray_net_map = Object.keys(this.data.net_map);
			if(aray_net_map.length == 0) return 1;
			//return Math.ceil(temp_data[this.controller_id()].items.length / content.elements.slots_count) || 1;
			var _length = Math.ceil(aray_net_map.length / 4);
			return Math.max(_length - Math.min(_length, 4) + 1, 0) || 1;
		} else {
			return 1;
		}
	},
	moveCurToPage: function (page) {
		if (!this.container.isOpened()) return;
		if (!this.isWorkAllowed()) {
			if (this.container.isOpened()) {
				var content = this.container.getGuiContent();
				content.elements["slider_button"].y = content.elements["slider_button"].start_y;
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
		content.elements["slider_button"].y = __getY(page);
		//this.container.setBinding("slider_button", 'y', __getY(page));
		//this.container.getWindow().getElements().get("slider_button").onBindingUpdated("y", __getY(page));
	},
	switchPage: function (num) {
		if (!this.container.isOpened() || this.data.NETWORK_ID == "f") return;
		var content = this.container.getGuiContent();
		//alert('Page update : ' + this.data.isActive)
		if(!this.data.isActive){
			for (var i = 0; i < 4; i++) {
				this.container.clearSlot("slot" + i);
				content.elements["slot" + i].z = -10;
				this.container.setText('block_info' + i, '');
				this.container.setText('block_count' + i, '');
				this.container.setText('block_energy_use' + i, '');
			}
			return;
		}
		num = num || 1;
		var pages = this.pages();
		num = Math.max(1, Math.min(num, pages)) - 1;
		var container = this.container;
		var aray_net_map = Object.keys(this.data.net_map);
		if(aray_net_map.length == 0){
			for (var i = 0; i < 4; i++) {
				//content.elements["slot" + i].bitmap = "empty";
				//content.elements["slot" + i].z = -100
				container.clearSlot("slot" + i);
				content.elements["slot" + i].z = -10;
				container.setText('block_info' + i, '');
				container.setText('block_count' + i, '');
				container.setText('block_energy_use' + i, '');
			}
		} else {
			for (var i = num * 2; i < num * 2 + 4; i++) {
				var a = i - (num * 2);
				var item = aray_net_map[i] ? this.data.net_map[aray_net_map[i]] : {};
				//content.elements["slot" + a].bitmap = "classic_slot";
				/*if(item.id)
					content.elements["slot" + a].z = 100;
				else
					content.elements["slot" + a].z = -100;*/
				content.elements["slot" + a].z = 10;
				container.setSlot("slot" + a, item.id || 0, 1, item.data || 0, item.extra || null);
				var name = item.id ? Item.getName(item.id, item.data || 0).split('\n')[0] : '';
				//if(a == 0)name = '123456789123456789123456789';
				if(name.length > controller_other_data['max_sym']) name = name.substr(0, controller_other_data['max_sym'] - 1) + '...';
				container.setText('block_info' + a, name);
				container.setText('block_count' + a, item.id ? item.count + 'x' : '');
				container.setText('block_energy_use' + i, item.id ? item.energy_use + ' FE/t' : '');
			}
		}
		this.data.page = num;
	},
	switchFullPage: function(page){
		this.switchPage(page);
		this.moveCurToPage(page - 1);
	},
	refreshPage: function () {
		this.switchPage(this.data.page);
	},
	refreshPageFull: function () {
		this.refreshPage();
		this.moveCurToPage(this.data.page - 1);
	},
	getCapacity: function () {
		return Config.controller.energyCapacity;
	},
	canReceiveEnergy: function (side, type) {
		return true;
	},
	isEnergySource: function () {
		return true;
	},
	updateNetMap: function(){
		var usage = 0;
		var net_map = {};
		for (var i in Network[this.data.NETWORK_ID]) {
			if (!Network[this.data.NETWORK_ID][i] || i == "info" || Network[this.data.NETWORK_ID][i].id == BlockID.RS_controller || !Network[this.data.NETWORK_ID][i].isActive) continue;
			var id_ = Network[this.data.NETWORK_ID][i].id;
			if(!net_map[String(id_)])
				net_map[String(id_)] = {id: id_, energy_use: 0, count: 1};
			else
				net_map[String(id_)].count++;
			if (id_ == BlockID.diskDrive) {
				var tile = World.getTileEntity(Network[this.data.NETWORK_ID][i].coords.x, Network[this.data.NETWORK_ID][i].coords.y, Network[this.data.NETWORK_ID][i].coords.z);
				//log(!!tile);
				if (!tile) continue;
				usage += EnergyUse['disk']*tile.data.disks;
				net_map[String(id_)].energy_use += EnergyUse['disk']*tile.data.disks;
			} else {
				usage += EnergyUse[id_] || 0;
				net_map[String(id_)].energy_use += EnergyUse[id_] || 0;
			}
		}
		this.data.net_map = net_map;
		this.data.usage = usage;
	},
	energyReceive: function (type, amount, voltage) {
		amount = Math.min(amount * EnergyTypeRegistry.getValueRatio(type, 'FE'), Config.controller.controllerMaxReceive);
		var add = Math.min(amount, this.getCapacity() - this.data.energy);
		if(!this.data.isActive && this.data.allowSetIsActive != false)this.setActive(true);
		this.data.energy += add;
		return type == 'Eu' ? add / 4 : add;
	},
	pre_setActive: function(state){
		if(state && this.data.energy <= 0) return true;
	},
	tick: function () {
		if (this.container.isOpened()) {
			//var content = this.container.getGuiContent();
			this.container.setScale('scale', this.data.energy / this.getCapacity());
			this.container.setText('storage', this.data.energy + '/' + this.getCapacity() + ' FE');
		}
		if(!this.data.isActive || this.data.NETWORK_ID == "f") return;
		var usage = 0;
		var net_map = {};
		for (var i in Network[this.data.NETWORK_ID]) {
			if (!Network[this.data.NETWORK_ID][i] || i == "info" || Network[this.data.NETWORK_ID][i].id == BlockID.RS_controller || !Network[this.data.NETWORK_ID][i].isActive) continue;
			var id_ = Network[this.data.NETWORK_ID][i].id;
			if(!net_map[String(id_)])
				net_map[String(id_)] = {id: id_, energy_use: 0, count: 1};
			else
				net_map[String(id_)].count++;
			if (id_ == BlockID.diskDrive) {
				var tile = World.getTileEntity(Network[this.data.NETWORK_ID][i].coords.x, Network[this.data.NETWORK_ID][i].coords.y, Network[this.data.NETWORK_ID][i].coords.z);
				//log(!!tile);
				if (!tile) continue;
				usage += EnergyUse['disk']*tile.data.disks;
				net_map[String(id_)].energy_use += EnergyUse['disk']*tile.data.disks;
			} else {
				usage += EnergyUse[id_] || 0;
				net_map[String(id_)].energy_use += EnergyUse[id_] || 0;
			}
		}
		this.data.net_map = net_map;
		this.data.usage = usage;
		if (this.data.energy >= usage && this.data.energy != 0){
			if(!this.data.activePost) {
				this.setActive(true);
				//set_is_active_for_blocks_net(this.data.NETWORK_ID, true, true);
				this.data.activePost = true;
			}
			if(Config.controller.usesEnergy && !this.data.isCreative)this.data.energy -= usage;
		} else {
			if(this.data.activePost) {
				this.setActive(false);
				//set_is_active_for_blocks_net(this.data.NETWORK_ID, false, true);
				this.data.activePost = false;
			}
		}
		if (this.container.isOpened()) {
			//var content = this.container.getGuiContent();
			//this.container.setScale('scale', this.data.energy / this.getCapacity());
			this.container.setText('usage', Translation.translate('Usage') + ": " + usage + " FE/t");
			if(World.getThreadTime() % 10 == 0){
				this.refreshPage();
			}
			//this.container.setText('storage', this.data.energy + '/' + this.getCapacity() + ' FE');
		}
		this.refreshModel();
	},
	refreshModel: function(){
		var newTexture = this.getNewTexture(this.getEnergyScaled(100));
		if (newTexture != this.data.lastTexture) {
			RefinedStorage.mapTexture(this, newTexture);
		}
	},
	destroy: function () {
		for(var i = 0; i < 4; i++)this.container.clearSlot('slot' + i);
		if (this.data.NETWORK_ID != "f" && Network[this.data.NETWORK_ID]) {
			this.data.LAST_NETWORK_ID = this.data.NETWORK_ID;
			//var str = this.x + ',' + this.y + ',' + this.z;
			set_net_for_blocks(this, 'f');
			delete Network[this.data.NETWORK_ID];
		}
		this.data.NETWORK_ID == "f";
		if(this.data.isCreative){
			World.drop(this.x + 0.5, this.y + 0.5, this.z + 0.5, BlockID['RS_controller'], 1, 3);
			return;
		}
		var extra = null;
		if (this.data.energy > 0) {
			extra = new ItemExtraData();
			extra.putInt('energy', this.data.energy);
		}
		var energyScaled = this.getEnergyScaled(100);
		var block_data = 0;
		if (energyScaled <= 0) {
			block_data = 0;
		} else if (energyScaled <= 20) {
			block_data = 1;
		} else {
			block_data = 2;
		}
		World.drop(this.x + 0.5, this.y + 0.5, this.z + 0.5, BlockID['RS_controller'], 1, block_data, extra);
		//clearInterval(this.data.interval);
	}
})
EnergyTileRegistry.addEnergyTypeForId(BlockID.RS_controller, FE);
EnergyTileRegistry.addEnergyTypeForId(BlockID.RS_controller, EU);
EnergyTileRegistry.addEnergyTypeForId(BlockID.RS_controller, RF);

/*Block.registerPlaceFunctionForID(BlockID.RS_controller, function(coords, item, block){
	if(World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z).id != 0) return;
	World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, item.id, item.data);
	World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z);
});*/
