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

Block.registerDropFunction("RS_controller", function (coords, id, data, diggingLevel, toolLevel, player, _blockSource) {
	return [];
});

Block.registerPlaceFunction("RS_controller", function (coords, item, block, player, blockSource) {
    if(!World.canTileBeReplaced(block.id, block.data)){
		var relBlock = blockSource.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
		if (World.canTileBeReplaced(relBlock.id, relBlock.data)){
			coords = coords.relative;
		} else return;
	}
	blockSource.setBlock(coords.x, coords.y, coords.z, item.id, item.data);
	var tile = World.addTileEntity(coords.x, coords.y, coords.z, blockSource) || World.getTileEntity(coords.x, coords.y, coords.z, blockSource);
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
	Entity.setCarriedItem(player, item.id, item.count - 1, item.data, item.extra);
});
var elementsGUI_controller = {};
var controller_other_data = {
	net_map:{},
	isActive: false,
	max_y: 0,
	lastPage: -1
};
var controllerSwitchPage = function(num, container, data, ignore){
	if(!data.isActive){
		for (var i = 0; i < 4; i++) {
			container.clearSlot("slot" + i);
			container.setText('block_info' + i, '');
			container.setText('block_count' + i, '');
			container.setText('block_energy_use' + i, '');
		}
		return false;
	}
	num = num || 1;
	var aray_net_map = Object.keys(data.net_map);
	var pages1 = controllerFuncs.getPages(aray_net_map.length);
	var pages = Math.max(1, pages1 - 1);
	num = Math.max(1, Math.min(num, pages)) - 1;
	if(num == data.lastPage && !ignore) return false;
	data.lastPage = num;
	if(aray_net_map.length == 0){
		for (var i = 0; i < 4; i++) {
			container.clearSlot("slot" + i);
			container.setText('block_info' + i, '');
			container.setText('block_count' + i, '');
			container.setText('block_energy_use' + i, '');
		}
	} else {
		for (var i = num * 2; i < num * 2 + 4; i++) {
			var a = i - (num * 2);
			var item = aray_net_map[i] ? data.net_map[aray_net_map[i]] : {};
			var _id = item.id ? Network.serverToLocalId(item.id) : 0;
			container.setSlot("slot" + a, _id, 1, item.data || 0, item.extra || null);
			var name = item.id ? Item.getName(_id, item.data || 0, item.extra).split('\n')[0] : '';
			if(name.length > controller_other_data['max_sym']) name = name.substr(0, controller_other_data['max_sym'] - 1) + '...';
			container.setText('block_info' + a, name);
			container.setText('block_count' + a, _id ? item.count + 'x' : '');
			container.setText('block_energy_use' + a, _id ? item.energy_use + ' FE/t' : '');
		}
	}
	return true;
}
function initControllerElements() {
	var moving = false;
	var swipe_y;
	var swipe_sum = 0;
	var max_y = 0;

	elementsGUI_controller["click_frame"] = {
		type: "frame",
		x: 0,
		y: 0,
		z: -50,
		width: 1000,
		height: UI.getScreenHeight(),
		bitmap: "empty",
		scale: 1,
		onTouchEvent: function (element, event) {
			var content = {elements:elementsGUI_controller};/* element.window.getContent(); *///getContainer().getGuiContent();
			var itemContainer = element.window.getContainer().getParent();
			if (event.type == "DOWN" && !swipe_y && event.x > content.elements["mesh"].x && event.x < (content.elements["mesh"].x + content.elements["mesh"].width) && event.y > content.elements["mesh"].y && event.y < (content.elements["mesh"].y + content.elements["mesh"].height)) {
				swipe_y = event.y;
			} else if (swipe_y && event.type == "MOVE") {
				var distance = Math.abs(event.y - swipe_y);
				function moveSwitchPage_(_n){
					_n = (_n ? 1 : -1);
					var pages = controllerFuncs.getPages(Object.keys(controller_other_data.net_map).length);
					if(!controllerSwitchPage(controller_other_data.lastPage + _n, itemContainer, controller_other_data)) return;
					var ___y = controllerFuncs.getCoordsFromPage(controller_other_data.lastPage + _n, pages);
					element.window.getContentProvider().elementMap.get("slider_button").setPosition(elementsGUI_controller['slider_button'].x, ___y);
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
				var page = controllerFuncs.getPageFromCoords(event, controllerFuncs.getPages(Object.keys(controller_other_data.net_map).length));
				controllerSwitchPage(page, itemContainer, controller_other_data);
				element.window.getContentProvider().elementMap.get("slider_button").setPosition(content.elements['slider_button'].x, Math.max(Math.min(event.y, max_y), content.elements["slider_button"].start_y));
			}
			if (event.type == "UP" || event.type == "CLICK") {
				moving = false;
				var pages = controllerFuncs.getPages(Object.keys(controller_other_data.net_map).length);
				var page = controllerFuncs.getPageFromCoords(event, pages);
				controllerSwitchPage(page, itemContainer, controller_other_data);
				var ___y = controllerFuncs.getCoordsFromPage(page, pages);
				element.window.getContentProvider().elementMap.get("slider_button").setPosition(elementsGUI_controller['slider_button'].x, ___y);
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
			//var itemContainer = element.window.getContainer().getParent();
			if (event.type == 'DOWN') {
				moving = true;
			}
			if (event.type == 'CLICK') {
				var pages = controllerFuncs.getPages(Object.keys(controller_other_data.net_map).length);
				var page = controllerFuncs.getPageFromCoords(event, pages);
				var ___y = controllerFuncs.getCoordsFromPage(page, pages);
				element.window.getContentProvider().elementMap.get("slider_button").setPosition(elementsGUI_controller['slider_button'].x, ___y);
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
			onClick: function (itemContainerUiHandler, container, element) {
				container.sendEvent("updateRedstoneMode", {});
			},
			onLongClick: function (itemContainerUiHandler, container, element) {
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
	controller_other_data.max_y = max_y;
};
initControllerElements();

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
testButtons(CONTROLLER_GUI.getWindow('header').getContent().elements, initControllerElements);

var controllerFuncs = {
	getNewTexture: function (energyScaled, isActive) {
		if (energyScaled <= 0 || !isActive) {
			return 'controller_off';
		} else if (energyScaled <= 20) {
			return 'controller_nearly_off';
		}
		return 'controller_on';
	},
	getEnergyScaled: function (scale, energy) {
		if(!energy && energy != 0){
			var energy = scale;
			var scale = 100;
		}
		return Math.floor(energy / Config.controller.energyCapacity * scale);
	},
	getPages: function(_length){
		if(_length == 0) return 1;
		_length = Math.ceil(_length / 2);
		return _length;//Math.max(_length - Math.min(_length, 4) + 1, 0) || 1;
	},
	getPageFromCoords: function(_coords, pages){
		pages -= 1;
		var max_y = controller_other_data.max_y;
		var interval = (pages - 1) > 0 ? (max_y - elementsGUI_controller["slider_button"].start_y) / (pages - 1) : 0;
		function __getY(i) {
			return ((interval * i) + elementsGUI_controller["slider_button"].start_y);
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
		pages -= 1;
		var max_y = controller_other_data.max_y;
		var interval = (pages - 1) > 0 ? (max_y - elementsGUI_controller["slider_button"].start_y) / (pages - 1) : 0;
		function __getY(i) {
			return ((interval * i) + elementsGUI_controller["slider_button"].start_y);
		}
		if (page > pages) page = pages;
		if (page < 1) page = 1;
		return __getY(page - 1);
	}
}

RefinedStorage.createTile(BlockID.RS_controller, {
	defaultValues: {
		NETWORK_ID: "f",
		energy: 0,
		usage: 0,
		lastTexture: '',
		page_switched: false,
		net_map: {},
		page: 1,
		redstone_mode: 0,
		isCreative: false,
		networkDataUpdate: false,
		containerUpdate: false,
		ticks: 0,
		updateControllerNetwork: false,
		updateModel: false,
		lastTexture: ''
	},
	unsaveableSlots: true,
	useNetworkItemContainer: true,
	created: function () {
        if(!this.blockSource)this.blockSource = BlockSource.getDefaultForDimension(this.dimension);
		while (controller = searchController(this, false, this.blockSource)) {
			for (var i in sides) {
				var coordss = {};
				coordss.x = this.x + sides[i][0];
				coordss.y = this.y + sides[i][1];
				coordss.z = this.z + sides[i][2];
				var bck = this.blockSource.getBlock(coordss.x, coordss.y, coordss.z);
				if (RS_blocks.indexOf(bck.id) != -1) {
					if(bck.id == BlockID.RS_cable){
						for(var i in RSNetworks){
							if(RSNetworks[i][cts(coordss)]){
								delete RSNetworks[i][cts(coordss)];
								if(InnerCore_pack.packVersionCode < 120) this.blockSource.destroyBlock(coordss.x, coordss.y, coordss.z, true);
								else this.blockSource.breakBlock(coordss.x, coordss.y, coordss.z, true);
								if(InnerCore_pack.packVersionCode < 120)Block.onBlockDestroyed(coordss, bck, false, Player.get());
								if(InnerCore_pack.packVersionCode < 120)Callback.invokeCallback('BlockChanged', coordss, {id:bck.id, data:bck.data}, {id:0, data:0}, this.dimension);
							}
						}
					} else {
						var tile = World.getTileEntity(coordss.x, coordss.y, coordss.z, this.blockSource);
						if (tile && tile.data.NETWORK_ID != 'f' && tile.data.NETWORK_ID != this.data.NETWORK_ID) {
							if(InnerCore_pack.packVersionCode < 120) this.blockSource.destroyBlock(coordss.x, coordss.y, coordss.z, true);
							else this.blockSource.breakBlock(coordss.x, coordss.y, coordss.z, true);
							if(InnerCore_pack.packVersionCode < 120)Block.onBlockDestroyed(coordss, bck, false, Player.get());
							if(InnerCore_pack.packVersionCode < 120)Callback.invokeCallback('BlockChanged', coordss, {id:bck.id, data:bck.data}, {id:0, data:0}, this.dimension);
						}
					}
				}
			}
		}
	},
	setActive: function(state, forced, preventRefreshModel){
		state = this.data.NETWORK_ID != "f" ? !!state : false;
		if(this.data.isActive == state && !forced) return false;
		if (this.pre_setActive) if(this.pre_setActive(state)) return false;
		if(state && !this.redstoneAllowActive(this.data.last_redstone_event)) return false;
		if(state && this.data.energy < this.data.usage) return false;
		if(state == false || (forced || this.data.allowSetIsActive != false)){
			this.data.isActive = state;
			this.networkData.putBoolean('isActive', state);
			if(this.data.NETWORK_ID != "f")RSNetworks[this.data.NETWORK_ID][this.coords_id()].isActive = state;
		}
		this.networkData.sendChanges();
		if(!preventRefreshModel)this.refreshModel();
		if (this.post_setActive) this.post_setActive(state);
		return true;
	},
	init: function () {
		//if (this.data.NETWORK_ID == "f" || !RSNetworks[this.data.NETWORK_ID]) {
			this.data.NETWORK_ID = RSNetworks.length;
			var controllerTile = this;
			this.networkData.putInt('energy', this.data.energy);
			this.networkData.putInt('NETWORK_ID', RSNetworks.length);
			this.networkData.putBoolean('isActive', this.data.isActive || false);
			if(this.unsaveableSlots && InnerCore_pack.packVersionCode >= 120){
				if(Array.isArray(this.unsaveableSlots)){
					for(var i in this.unsaveableSlots)this.container.setSlotSavingEnabled(this.unsaveableSlots[i], false);
				} else {
					this.container.setGlobalSlotSavingEnabled(false);
				}
			}
			var _data = {};
			_data[cts(this)] = {
				id: BlockID.RS_controller,
				coords: { x: this.x, y: this.y, z: this.z },
				upgrades: {},
				isActive: false
			}
			_data['info'] = {
				net_id: RSNetworks.length,
				//disk_items_map: {},
				disk_map: [],
				just_items_map: {},
				just_items_map_extra: {},
				items_map: [],
				items: [],
				openedGrids: [],
				storage: 0,
				stored: 0,
				refreshOpenedGrids: function(_full){
					for(var i in this.openedGrids){
						var __coords = this.openedGrids[i];
						var tile = World.getTileEntity(__coords.x, __coords.y, __coords.z, controllerTile.blockSource);
						tile.data.fullRefreshPage = _full;
						tile.data.refreshCurPage = true;
					}
				},
				updateItems: function(){
					if(Config.dev)Logger.Log('Updating items', 'RefinedStorageDebug');
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
						var tile = World.getTileEntity(diskDrives[i].coords.x, diskDrives[i].coords.y, diskDrives[i].coords.z, controllerTile.blockSource);
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
								if(just_items_map[diskItem.id]){
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
				pushItem: function(item, count, nonUpdate){
					count = count || item.count;
					if(RSbannedItems.indexOf(item.id) != -1){
						if(Config.dev)Logger.Log('Hey you shouldn t push this item:   id: ' + item.id + ', count: ' + count + ' (' + item.count + '), data: ' + item.data + (item.extra ? ', extra: ' + item.extra.getValue() : '') + ', uid: ' + itemUid + ', storage: ' + this.storage + ', stored: ' + this.stored + ' (' + (this.stored + count) + ')' + ', freespace: ' + (this.storage - this.stored) + ' (' + ((this.storage - this.stored) - count) + ')', 'RefinedStorageDebug');
						return count;
					}
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
						//if(!item.name)item.name = Item.getName(item.id, item.data, item.extra);
						this.items.push({
							id: item.id,
							data: item.data,
							count: Math.min(count, this.storage - this.stored),
							extra: item.extra,
							//name: item.name
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
									//name: item.name
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
									//name: item.name
								}
								this.disk_map[i][k].items_stored += count;
								this.disk_items_map[itemUid].push(this.disk_map[i][k].items[itemUid], this.disk_map[i][k]);
								return 0;
							}
						}
					}
					return count; */
					if(Config.dev)Logger.Log('Pushing item:  id: ' + item.id + ', count: ' + count + ' (' + item.count + '), data: ' + item.data + (item.extra ? ', extra: ' + item.extra.getValue() + "_" + fullExtraToString(item.extra, true) : '') + ', uid: ' + itemUid + ', storage: ' + this.storage + ', stored: ' + this.stored + ' (' + (this.stored + count) + ')' + ', freespace: ' + (this.storage - this.stored) + ' (' + ((this.storage - this.stored) - count) + ')', 'RefinedStorageDebug');
					for(var i in _data){
						if(_data[i].pushItemFunc)count = ((__answ = _data[i].pushItemFunc(item, count)) != undefined ? __answ : count);
						if(count <= 0) return 0;
					}
					var index = this.items_map.indexOf(itemUid);
					var itemUidExtra = item.id+'_'+item.data;
					if(item.extra && index == -1 && this.just_items_map_extra[itemUidExtra])for(var iasd in this.just_items_map_extra[itemUidExtra]){
						var ___extra = this.just_items_map_extra[itemUidExtra][iasd];
						//if(Config.dev)Logger.Log('Comparing extra: ' + fullExtraToString(item.extra, true) + " with: " + fullExtraToString(___extra, true), 'RefinedStorageDebug');
						if(fullExtraToString(item.extra, true) == fullExtraToString(___extra, true)){
							item.extra = ___extra;
							itemUid = getItemUid(item);
							index = this.items_map.indexOf(itemUid);
							break;
						}
					}
					if(index != -1){
						for(var i in this.disk_map){
							for(var k in this.disk_map[i]){
								if(count == 0 || this.storage - this.stored == 0){
									if(!nonUpdate)this.refreshOpenedGrids();
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
										if(!nonUpdate)this.refreshOpenedGrids();
										return 0;
									}
								};
							}
						}
					} else {
						//if(!item.name)item.name = Item.getName(item.id, item.data, item.extra);
						this.items.push({
							id: item.id,
							data: item.data,
							count: Math.min(count, this.storage - this.stored),
							extra: item.extra/* ,
							name: item.name */
						});
						this.items_map.push(itemUid);
						if(this.just_items_map[item.id]){
							this.just_items_map[item.id].push(item.data);
						} else if(!this.just_items_map[item.id]){
							this.just_items_map[item.id] = [item.data];
						}
						if(item.extra){
							if(this.just_items_map_extra[itemUidExtra]){
								this.just_items_map_extra[itemUidExtra].push(item.extra);
							} else if(!this.just_items_map_extra[itemUidExtra]){
								this.just_items_map_extra[itemUidExtra] = [item.extra];
							}
						}
					}
					//if(!item.name)item.name = Item.getName(item.id, item.data, item.extra);
					//this.stored += count1;
					for(var i in this.disk_map){
						for(var k in this.disk_map[i]){
							if(count == 0 || this.storage - this.stored == 0) {
								if(!nonUpdate)this.refreshOpenedGrids(true);
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
									extra: item.extra/* ,
									name: item.name */
								}
								this.disk_map[i][k].items_stored += freeSpace;
							} else {
								this.stored += count;
								this.disk_map[i][k].items[itemUid] = {
									id: item.id,
									data: item.data,
									count: count,
									extra: item.extra/* ,
									name: item.name */
								}
								this.disk_map[i][k].items_stored += count;
								if(!nonUpdate)this.refreshOpenedGrids(true);
								return 0;
							}
						}
					};
					//}
					if(!nonUpdate)this.refreshOpenedGrids();
				},
				itemCanBeDeleted: function(item, count){
					count = count || item.count;
					if(count > this.stored) return false;
					var itemUid = getItemUid(item);
					if((iItem = this.items_map.indexOf(itemUid)) != -1){
						return true;
					} else {
						return false;
					}
				},
				deleteItem: function(item, count, nonUpdate){
					count = count || item.count;
					if(!this.itemCanBeDeleted(item, count)) return count;
					if((!item.data && item.data != 0) || item.data == -1) item.data = this.just_items_map[item.id][0];
					if(item.extra === undefined)item.extra = null;
					if((!item.extra && item.extra != null) || item.extra == -1) item.extra = this.just_items_map_extra[item.id+'_'+item.data][0] || null;
					var itemUid = getItemUid(item);
					if(Config.dev)Logger.Log('Deleting item:  id: ' + item.id + ', count: ' + count + ' (' + item.count + '), data: ' + item.data + (item.extra ? ', extra: ' + item.extra.getValue() + "_" + fullExtraToString(item.extra, true) : '') + ', uid: ' + itemUid + ', storage: ' + this.storage + ', stored: ' + this.stored + ' (' + (this.stored - count) + ')' + ', freespace: ' + (this.storage - this.stored) + ' (' + ((this.storage - this.stored) + count) + ')', 'RefinedStorageDebug');
					for(var i in _data){
						if(_data[i].deleteItemFunc)count = _data[i].deleteItemFunc(item, count) || count;
						if(count <= 0) return 0;
					}
					var num = this.items_map.indexOf(itemUid);
					var itemUidExtra = item.id+'_'+item.data;
					if(item.extra && num == -1 && this.just_items_map_extra[itemUidExtra])for(var iasd in this.just_items_map_extra[itemUidExtra]){
						var ___extra = this.just_items_map_extra[itemUidExtra][iasd];
						if(Config.dev)Logger.Log('Comparing extra: ' + fullExtraToString(item.extra, true) + " with: " + fullExtraToString(___extra, true), 'RefinedStorageDebug');
						if(fullExtraToString(item.extra, true) == fullExtraToString(___extra, true)){
							item.extra = ___extra;
							itemUid = getItemUid(item);
							num = this.items_map.indexOf(itemUid);
							break;
						}
					}
					if(num != -1){
						var count1 = Math.min(count, this.stored, this.items[num].count);
						if(count >= this.items[num].count){
							this.items_map.splice(num, 1);
							this.items.splice(num, 1);
							if((justIMap = this.just_items_map[item.id].indexOf(item.data)) != -1)this.just_items_map[item.id].splice(justIMap, 1);
							if(this.just_items_map[item.id].length == 0)delete this.just_items_map[item.id];
							if(item.extra){
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
										if(!nonUpdate)this.refreshOpenedGrids(true);
										return count - count1;
									}
								}
							}
						} else {
							this.items[num].count -= count1;
							for(var i in this.disk_map){
								for(var k in this.disk_map[i]){
									if(count == 0 || this.stored == 0) {
										if(!nonUpdate)this.refreshOpenedGrids();
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
											if(!nonUpdate)this.refreshOpenedGrids();
											return 0;
										}
									};
								}
							}
							if(!nonUpdate)this.refreshOpenedGrids();
							return count;
						}
					} else {
						//alert('Hey are you doing something wrong');
						return count;
					}
					if(!nonUpdate)this.refreshOpenedGrids();
				}
			}
			RSNetworks.push(_data);
			this.networkData.sendChanges();
			this.data.ticks = 0;
			this.data.timer = 20;
		//}
	},
	updateItems: function(){
		if(this.data.NETWORK_ID != 'f'){
			RSNetworks[this.data.NETWORK_ID].info.updateItems();
		}
	},
	updateControllerNetwork: function(_first){
		set_net_for_blocks(this, this.data.NETWORK_ID, false, _first, _first ? undefined : this.data.isActive);
	},
	click: function (id, count, data, coords, player, extra) {
		if(Entity.getSneaking(player)) return false;
		var client = Network.getClientForPlayer(player);
		if(!client) return true;
		if (this.container.getNetworkEntity().getClients().contains(client)) return true;
		this.container.openFor(client, "main");
		var _data = {
			name: this.networkData.getName() + '', 
			isActive: this.data.isActive, 
			capacity: this.getCapacity(), 
			redstone_mode: this.data.redstone_mode, 
			usage: this.data.usage, 
			energy: this.data.energy, 
			isCreative: this.data.isCreative, 
			net_map: this.data.net_map
		};
		this.container.sendEvent(client, "openGui", _data); 
		this.container.setScale('scale', this.data.energy / this.getCapacity());
		this.container.setText('usage', Translation.translate('Usage')+": " + this.data.usage + " FE/t");
		this.container.setText('storage', this.data.energy + '/' + this.getCapacity() + ' FE');
		this.container.sendChanges();
		return true;
	},
	post_setActive: function(state){
		set_is_active_for_blocks_net(this.data.NETWORK_ID, state, true, this.blockSource);
		if(!state){
			this.data.net_map = {};
			this.data.usage = 0;
			this.container.setText('usage', Translation.translate('Usage') + ": 0 FE/t");
			this.container.sendChanges();
		} else {
			this.updateNetMap();
			this.container.setText('usage', Translation.translate('Usage')+": " + this.data.usage + " FE/t");
			this.container.sendChanges();
		}
		this.refreshGui();
	},
	pages: function () {
		if (this.container.getNetworkEntity().getClients().iterator().hasNext() && this.data.NETWORK_ID != "f" && this.data.isActive) {
			var aray_net_map = Object.keys(this.data.net_map);
			return controllerFuncs.getPages(aray_net_map.length);
		} else {
			return 1;
		}
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
	updateNetMap: function(_ignoreIsActive){
		var usage = 0;
		var net_map = {};
		for (var i in RSNetworks[this.data.NETWORK_ID]) {
			if (!RSNetworks[this.data.NETWORK_ID][i] || i == "info" || RSNetworks[this.data.NETWORK_ID][i].id == BlockID.RS_controller || (!RSNetworks[this.data.NETWORK_ID][i].isActive && !_ignoreIsActive)) continue;
			var networkTile = RSNetworks[this.data.NETWORK_ID][i];
			var id_ = networkTile.id;
			if(!net_map[String(id_)])
				net_map[String(id_)] = {id: id_, energy_use: 0, count: 1};
			else
				net_map[String(id_)].count++;
			if (id_ == BlockID.diskDrive) {
				var tile = World.getTileEntity(networkTile.coords.x, networkTile.coords.y, networkTile.coords.z, this.blockSource);
				if (!tile) continue;
				var __usage = EnergyUse['disk']*tile.data.disks;
				usage += __usage;
				net_map[String(id_)].energy_use += __usage;
			} else {
				var __usage = EnergyUse[id_] || 0;
				for(var j in networkTile.upgrades)__usage += UpgradeRegistry.getEnergyUsage(j)*networkTile.upgrades[j];
				usage += __usage;
				net_map[String(id_)].energy_use += __usage;
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
		this.networkData.putInt('energy', this.data.energy);
		this.data.networkDataUpdate = true;
		this.data.updateModel = true;
		return type == 'Eu' ? add / 4 : add;
	},
	pre_setActive: function(state){
		if(state && this.data.energy <= 0) return true;
	},
	tick: function () {
		if(this.data.timer){
			this.data.ticks++;
			if(this.data.ticks >= this.data.timer) {
				this.updateControllerNetwork(true);
				this.updateItems();
				this.updateNetMap(true);
				this.setActive(this.data.energy > this.data.usage, true, true);
				this.refreshModel();
				this.data.timer = false;
				this.data.ticks = 0;
			}
		}
		if (this.container.getNetworkEntity().getClients().iterator().hasNext()) {
			this.container.setScale('scale', this.data.energy / this.getCapacity());
			this.container.setText('storage', this.data.energy + '/' + this.getCapacity() + ' FE');
			this.data.containerUpdate = true;
		}
		if(!this.isWorkAllowed()) {
			if(this.data.containerUpdate){
				this.container.sendChanges();
				this.data.containerUpdate = false;
			}
			return;
		}
		if(this.data.updateControllerNetwork){
			this.updateControllerNetwork();
			this.data.updateControllerNetwork = false;
		}
		this.updateNetMap();
		if (this.data.energy >= this.data.usage && this.data.energy != 0){
			this.setActive(true);
			if(Config.controller.usesEnergy && !this.data.isCreative){
				this.data.energy -= this.data.usage;
				this.networkData.putInt('energy', this.data.energy);
				this.data.networkDataUpdate = true;
				this.data.updateModel = true;
			}
		} else {
			this.setActive(false);
		}
		if(this.data.networkDataUpdate){
			this.networkData.sendChanges();
			this.data.networkDataUpdate = false;
		}
		if(this.data.containerUpdate){
			this.container.sendChanges();
			this.data.containerUpdate = false;
		}
		if(this.data.updateModel){
			var texture = controllerFuncs.getNewTexture(controllerFuncs.getEnergyScaled(this.data.energy), this.data.isActive);
			if(this.data.lastTexture != (this.data.lastTexture = texture)) this.refreshModel();
			this.data.updateModel = false;
		}
	},
	refreshModel: function(){
		if(!this.networkEntity) return Logger.Log(Item.getName(this.blockInfo.id, this.blockInfo.data) + ' model on: ' + cts(this) + ' cannot be displayed');
		this.sendPacket("refreshModel", {energy: this.data.energy, isActive: this.data.isActive, coords: {x: this.x, y: this.y, z: this.z}});
	},
	destroy: function (param1, isDropAllowed) {
		if (this.data.NETWORK_ID != "f" && RSNetworks[this.data.NETWORK_ID]) {
			set_net_for_blocks(this, 'f');
			delete RSNetworks[this.data.NETWORK_ID];
		}
		if(!isDropAllowed && isDropAllowed !== undefined) return;
		this.data.LAST_NETWORK_ID = this.data.NETWORK_ID;
		this.data.NETWORK_ID == "f";
		if(this.data.isCreative){
			this.blockSource.spawnDroppedItem(this.x + 0.5, this.y + 0.5, this.z + 0.5, BlockID['RS_controller'], 1, 3, null);
			return;
		}
		var extra = null;
		if (this.data.energy > 0) {
			extra = new ItemExtraData();
			extra.putInt('energy', this.data.energy);
		}
		var block_data = 0;
		var energyScaled = controllerFuncs.getEnergyScaled(100, this.data.energy);
		if (energyScaled <= 0) {
			block_data = 0;
		} else if (energyScaled <= 20) {
			block_data = 1;
		} else {
			block_data = 2;
		}
		this.blockSource.spawnDroppedItem(this.x + 0.5, this.y + 0.5, this.z + 0.5, BlockID['RS_controller'], 1, block_data, extra);
	},
	getScreenByName: function(screenName) {
		if(screenName == 'main')return CONTROLLER_GUI;
	},
	refreshGui: function(){
		this.container.sendEvent("refreshGui", {isActive: this.data.isActive, capacity: this.getCapacity(), redstone_mode: this.data.redstone_mode, usage: this.data.usage, energy: this.data.energy, isCreative: this.data.isCreative, net_map: this.data.net_map});
	},
	client: {
		load: function(){
			if(Config.dev)Logger.Log('Loaded Controller client tile: energy: ' + this.networkData.getInt('energy') + ' ; isActive: ' + this.networkData.getBoolean('isActive'), 'RefinedStorageDebug');
			if(this.refreshModel)this.refreshModel();
		},
		refreshModel: function(eventData, connectedClient){
			if(Config.dev)Logger.Log('Local refreshing Controller model: energy: ' + this.networkData.getInt('energy') + ' ; isActive: ' + this.networkData.getBoolean('isActive'), 'RefinedStorageDebug');
			var newTexture = controllerFuncs.getNewTexture(controllerFuncs.getEnergyScaled(100, this.networkData.getInt('energy')), this.networkData.getBoolean('isActive'));
			RefinedStorage.mapTexture(this, newTexture);
		},
		events: {
			refreshModel: function(eventData, connectedClient){
				if(Config.dev)Logger.Log('Event refreshing Controller model: energy: ' + eventData.energy + ' ; isActive: ' + eventData.isActive, 'RefinedStorageDebug');
				var newTexture = controllerFuncs.getNewTexture(controllerFuncs.getEnergyScaled(100, eventData.energy), eventData.isActive);
				RefinedStorage.mapTexture(eventData.coords, newTexture);
			}
		},
		containerEvents: {
			openGui: function(container, window, windowContent, eventData){
				if(!windowContent || !window || !window.isOpened()) return;
				var networkData = SyncedNetworkData.getClientSyncedData(eventData.name);
				controller_other_data.networkData = networkData;
				controller_other_data.net_map = eventData.net_map;
				controller_other_data.isActive = eventData.isActive;
				var headerWindow = window.getWindow('header')
				headerWindow.getContent().drawing[2].text = eventData.isCreative ? Translation.translate("Creative Controller") : Translation.translate("Controller");
				headerWindow.forceRefresh();
				windowContent.elements["slider_button"].y = windowContent.elements["slider_button"].start_y;
				windowContent.elements["image_redstone"].bitmap = 'redstone_GUI_' + (eventData.redstone_mode || 0);
				controllerSwitchPage(1, container, controller_other_data, true);
			},
			refreshGui:function(container, window, windowContent, eventData){
				if(!windowContent || !window || !window.isOpened()) return;
				controller_other_data.net_map = eventData.net_map;
				controller_other_data.isActive = eventData.isActive;
				windowContent.elements["image_redstone"].bitmap = 'redstone_GUI_' + (eventData.redstone_mode || 0);
				controllerSwitchPage(controller_other_data.lastPage, container, controller_other_data, true);

			}
		}
	},
	containerEvents: {
		updateRedstoneMode: function(eventData, connectedClient) {
			if(this.data.redstone_mode == undefined) this.data.redstone_mode = 0;
			this.data.redstone_mode = this.data.redstone_mode >= 2 ? 0 : this.data.redstone_mode + 1;
			if(!this.refreshRedstoneMode()) this.refreshGui();
		}
	}
})
EnergyTileRegistry.addEnergyTypeForId(BlockID.RS_controller, FE);
EnergyTileRegistry.addEnergyTypeForId(BlockID.RS_controller, EU);
EnergyTileRegistry.addEnergyTypeForId(BlockID.RS_controller, RF);