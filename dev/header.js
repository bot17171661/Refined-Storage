const DISPLAY = UI.getContext().getWindow().getWindowManager().getDefaultDisplay();
const WorkbenchRecipes = WRAP_JAVA('com.zhekasmirnov.innercore.api.mod.recipes.workbench.WorkbenchRecipeRegistry');
const WorkbenchFieldAPI = WRAP_JAVA('com.zhekasmirnov.innercore.api.mod.recipes.workbench.WorkbenchFieldAPI');
const zhekaCompiler = WRAP_JAVA('com.zhekasmirnov.innercore.mod.executable.Compiler');
const _setTip = ModAPI.requireGlobal("MCSystem.setLoadingTip");

IMPORT("EnergyNet");
IMPORT("StorageInterface");

var Config = {
	reload: function () {
		reload = Config.reload;
		Config = FileTools.ReadJSON(__dir__ + 'config.json');
		Config.reload = reload;
	}
}
Config.reload();

const FE = EnergyTypeRegistry.assureEnergyType("FE", 0.25);
const EU = EnergyTypeRegistry.assureEnergyType("Eu", 1);
const RF = EnergyTypeRegistry.assureEnergyType("RF", 0.25);

const RSgroup = ICRender.getGroup("RefinedStoragePECable");

const GUIs = [];

const runOnUiThread = function(func_, _interval){
	if(_interval)return function(){
		return UI.getContext().runOnUiThread(new java.lang.Runnable({
			run: func_
		}));
	};
	return UI.getContext().runOnUiThread(new java.lang.Runnable({
		run: func_
	}));
}

var EMPTY_SAVER = Saver.registerObjectSaver('THIS_IS_EMPTY_SAVER', {
	read: function(){return null},
	save: function(){return null}
});

const searchController = function (_coords, _self) {
	var outCoords = [];
	outCoords.push(cts(_coords));
	var s = false;
	function _search(coords) {
		var coordss = {};
		for (var i in sides) {
			coordss.x = coords.x + sides[i][0];
			coordss.y = coords.y + sides[i][1];
			coordss.z = coords.z + sides[i][2];
			if (outCoords.indexOf(cts(coordss)) != -1) continue;
			outCoords.push(cts(coordss));
			var bck = World.getBlock(coordss.x, coordss.y, coordss.z);
			if (bck.id == BlockID.RS_controller) {
				s = coordss;
				return;
			} else if (RS_blocks.indexOf(bck.id) != -1) {
				_search(coordss);
			}
		}
	}
	if(_self){
		var bck = World.getBlock(_coords.x, _coords.y, _coords.z);
		if (bck.id == BlockID.RS_controller) {
			s = _coords;
			return s;
		}
	}
	_search(_coords);
	return s;
}

const searchController_net = function (net_id) {
	if (net_id == 'f') return false;
	for (var i in RSNetworks[net_id]) {
		if (i != 'info' && RSNetworks[net_id][i].id == BlockID.RS_controller) return RSNetworks[net_id][i].coords;
	}
}

function set_net_for_blocks(_coords, net_id, _self, _first, _defaultActive, _func) {
	var blockSource_ = _coords.blockSource;
	var outCoords = [];
	outCoords.push(cts(_coords));
	var cableDeleting = [];
	function _search(coords) {
		for (var i in sides) {
			var coordss = {};
			coordss.x = coords.x + sides[i][0];
			coordss.y = coords.y + sides[i][1];
			coordss.z = coords.z + sides[i][2];
			if (outCoords.indexOf(cts(coordss)) != -1) continue;
			outCoords.push(cts(coordss));
			var bck = {id: blockSource_.getBlockId(coordss.x, coordss.y, coordss.z)};
			var isRsBlock = (RS_blocks.indexOf(bck.id) != -1);
			if (bck.id == BlockID.RS_controller) {
				blockSource_.destroyBlock(coordss.x, coordss.y, coordss.z, true);
				continue;
			} else if (bck.id == BlockID.RS_cable) {
				if(net_id != 'f' && RSNetworks[net_id]){
					RSNetworks[net_id][cts(coordss)] = {
						id: BlockID.RS_cable,
						coords: coordss,
						isActive: true
					}
				} else {
					cableDeleting.push(cts(coordss));
				}
				_search(coordss);
			} else if (isRsBlock) {
				var tile = World.getTileEntity(coordss.x, coordss.y, coordss.z, blockSource_) || World.addTileEntity(coordss.x, coordss.y, coordss.z, blockSource_);
				if (tile) {
					tile.data.controller_coords = {x: _coords.x, y: _coords.y, z: _coords.z};
					tile.update_network(net_id, _first || (_defaultActive != undefined));
					if(_defaultActive)tile.setActive(_defaultActive);
				}
				_search(coordss);
			}
		}
	}
	if(_self){
		var bck = {id: blockSource_.getBlockId(_coords.x, _coords.y, _coords.z)};
		var isRsBlock = RS_blocks.indexOf(bck.id) != -1;
		if (isRsBlock && bck.id != BlockID.RS_controller) {
			if (bck.id == BlockID.RS_cable) {
				if(net_id != 'f' && RSNetworks[net_id]){
					RSNetworks[net_id][cts(_coords)] = {
						id: BlockID.RS_cable,
						coords: _coords,
						isActive: true
					}
				} else {
					cableDeleting.push(cts(_coords));
				}
			} else {
				var tile = World.getTileEntity(_coords.x, _coords.y, _coords.z, blockSource_) || World.addTileEntity(_coords.x, _coords.y, _coords.z, blockSource_);
				if (tile) {
					tile.data.controller_coords = {x: _coords.x, y: _coords.y, z: _coords.z};
					tile.update_network(net_id, _first || (_defaultActive != undefined));
					if(_defaultActive)tile.setActive(_defaultActive);
				}
			}
		}
	}
	_search(_coords);
	if(cableDeleting.length > 0){
		for(var i in RSNetworks){
			for(var k in cableDeleting){
				if(RSNetworks[i][cableDeleting[k]]) delete RSNetworks[i][cableDeleting[k]];
			}
		}
	}
}

function set_is_active_for_blocks(_coords, _state, isController) {
	var blockSource_ = _coords.blockSource;
	var outCoords = [];
	outCoords.push(cts(_coords));
	function _search(coords) {
		for (var i in sides) {
			var coordss = {};
			coordss.x = coords.x + sides[i][0];
			coordss.y = coords.y + sides[i][1];
			coordss.z = coords.z + sides[i][2];
			if (outCoords.indexOf(cts(coordss)) != -1) continue;
			outCoords.push(cts(coordss));
			var bck = {id: blockSource_.getBlockId(coordss.x, coordss.y, coordss.z)};
			if (bck.id == BlockID.RS_controller) {
				continue;
			} else if (RS_blocks.indexOf(bck.id) != -1) {
				var tile = World.getTileEntity(coordss.x, coordss.y, coordss.z, blockSource_);
				if (tile) {
					if(isController && !_state) 
						tile.data.controllerOff = true;
					else
						tile.data.controllerOff = false;
					tile.setActive(_state);
				}
				_search(coordss);
			}
		}
	}
	_search(_coords);
}

function set_is_active_for_blocks_net(net_id, _state, isController, _blockSource) {
	for(var i in RSNetworks[net_id]){
		if(i != 'info' && RSNetworks[net_id][i].id != BlockID.RS_controller){
			var tile = World.getTileEntity(RSNetworks[net_id][i].coords.x, RSNetworks[net_id][i].coords.y, RSNetworks[net_id][i].coords.z, _blockSource);
			if (tile) {
				if(isController) tile.data.controllerOff = !_state;
				tile.setActive(_state);
			}
		}
	}
}

function checkAndSetNetOnCoords(coords, update){
	if(!(controllerCoords = searchController(coords, true)))set_net_for_blocks(coords, 'f', true);
	if(update && controllerCoords && (tile = coords.blockSource.getTileEntity(controllerCoords.x, controllerCoords.y, controllerCoords.z)))tile.updateControllerNetwork();
}

function searchBlocksInNetwork(net_id, id){
	var res = [];
	if(!RSNetworks[net_id]) return res;
	for(var i in RSNetworks[net_id]){
		if(RSNetworks[net_id][i] && RSNetworks[net_id][i].id == id){
			res.push(RSNetworks[net_id][i]);
		}
	}
	return res;
}

function getItemUid(item){
	return item.id + '_' + item.data + (item.extra ? '_' + item.extra.getValue() : '');
}

function parseItemUid(itemUid){
	var splits = itemUid.split('_');
	return {
		id: splits[0],
		data: splits[1],
		extra: splits[2] || null
	}
}

function eventToScriptable(_event){
	return {y:_event.y, x: _event.x, type: _event.type, _x: _event._x, _y:_event._y, localY: _event.localY, localX: _event.localX};
}

var DiskData = [false];
Saver.addSavesScope("RSDiskData",
	function read(scope){
		DiskData = scope && scope.DiskData ? scope.DiskData.map(function(elem){
			if(elem){
				if(elem.storage == 'Infinity')elem.storage = Infinity;
				var itemsReplacing = [];
				for(var i in elem.items){
					if(elem.items[i].extra){
						itemsReplacing.push([i, getItemUid(elem.items[i]), elem.items[i]]);
					}
				}
				for(var i in itemsReplacing){
					elem.items[itemsReplacing[i][1]] = itemsReplacing[i][2];
					delete elem.items[itemsReplacing[i][0]];
				}
			}
			return elem;
		}) : [false];
	},

	function save(){
		return {DiskData: DiskData.map(function(elem){
			if(elem && elem.storage == Infinity){
				elem = Object.assign({}, elem);
				elem.storage = 'Infinity';
			}
			return elem;
		})};
	}
);
Callback.addCallback("LevelLeft", function(){
	DiskData = [false];
});

const Disk = {
	getDiskData: function(item){
		if(!this.items[item.id]) return;
		if(!DiskData)DiskData = [false];
		if(item.data && !DiskData[item.data]) DiskData[item.data] = this.getDefaultData(this.items[item.id].storage);
		return DiskData[item.data];
	},
	getDefaultData: function(storage){
		var data = {
			storage: storage,
			items_stored: 0,
			items: {}
		}
		return data;
	},
	getDefaultExtra: function(storage){
		var extra = new ItemExtraData();
		var data = {
			storage: storage,
			items_stored: 0,
			items: {}
		}
		extra.putSerializable('disk_data', data);
		return extra;
	},
	items: {},
	register: function (name, texture, storage) {
		for (var i in this.items) {
			if (this.items[i].storage == storage) {
				log('Disk with such storage already exists');
				return  -1;
			}
		}
		IDRegistry.genItemID("storageDisk" + storage);
		Item.createItem("storageDisk" + storage, name, {
			name: texture,
		}, {
			//isTech: true,
			stack: 1
		});
		mod_tip(ItemID["storageDisk" + storage]);
		Item.registerNameOverrideFunction(ItemID["storageDisk" + storage], function (item, name) {
			var disk_data = DiskData[item.data];
			if(!disk_data) return name + "\n§7" + Translation.translate('Stored') + (storage != Infinity ? ': 0/' + storage : ': 0');
			name += "\n§7" + Translation.translate('Stored') + ': ' + disk_data.items_stored + (disk_data.storage != Infinity ? '/' + disk_data.storage : '');
			return name;
		});
		this.items[ItemID["storageDisk" + storage]] = { name: name, texture: texture, storage: storage };
		return ItemID["storageDisk" + storage];
	},
	update: function (extra) {
		var diskData = this.getDiskData(item);
		var items_stored = 0;
		for (var i in diskData.items) {
			var item = diskData.items[i];
			if (!item) return alert('Wow, this is a bad disk');
			items_stored += item.count;
		}
		diskData.items_stored = items_stored;
	},
	freeSpace: function (item) {
		var diskData = this.getDiskData(item);
		return diskData.storage - diskData.items_stored;
	}
}

var itemsNamesMap = {};

const getItemName = function(id, data){
	if(!itemsNamesMap[id+','+data]) itemsNamesMap[id+','+data] = Item.getName(id, data);
	return itemsNamesMap[id+','+data];
}

var RSNetworks = [];

const RS_blocks = [];
Callback.addCallback('PostLoaded', function(){
	for(var i in RS_blocks)World.setBlockChangeCallbackEnabled(RS_blocks[i], true);
})

Callback.addCallback('BlockChanged', function(coords, oldBlock, newBlock, _blockSource){
	_blockSource = BlockSource.getDefaultForDimension(_blockSource);
	coords.blockSource = _blockSource;
	if (oldBlock.id == BlockID.RS_cable) {
		for(var i in RSNetworks){
			if(RSNetworks[i][cts(coords)]) delete RSNetworks[i][cts(coords)];
		}
	}
	var isOldBlock = RS_blocks.indexOf(oldBlock.id) != -1;
	var isNewBlock = RS_blocks.indexOf(newBlock.id) != -1;
	if(isNewBlock && newBlock.id != BlockID.RS_cable)World.addTileEntity(coords.x, coords.y, coords.z, _blockSource);
	if(oldBlock.id != BlockID.RS_controller && isOldBlock)for(var i in sides){
		var zCoords = {
			x: coords.x + sides[i][0],
			y: coords.y + sides[i][1],
			z: coords.z + sides[i][2],
			blockSource: _blockSource
		}
		checkAndSetNetOnCoords(zCoords);
	}
	if(newBlock.id == BlockID.RS_cable){
		if((controllerCoords = searchController(coords, true)) && (tile = World.getTileEntity(controllerCoords.x, controllerCoords.y, controllerCoords.z, _blockSource)))tile.updateControllerNetwork();
	}
});

const EnergyUse = {}

var temp_data = {};

Callback.addCallback("LevelLeft", function () {
	temp_data = {};
	RSNetworks = [];
});

const RefinedStorage = {
	paramsMap: {},
	createTile: function (id, params) {
		RSgroup.add(id, -1);
		if(!params.defaultValues) params.defaultValues = {};
		params.defaultValues.NETWORK_ID = 'f';
		params.defaultValues.last_redstone_event = {power: 0};
		params.blockInfo = {
			id: id
		}
		if(!params.client) params.client = {};
		if(!params.client.load) params.client.load = function(){
			if(this.pre_load)this.pre_load();
			if(this.refreshModel)this.refreshModel();
			if(this.post_load)this.pre_load();
		}
		if(!params.client.unload) params.client.unload = function(){
			if(this.pre_unload)this.pre_unload();
			BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
			if(this.post_unload)this.pre_unload();
		}
		if(!params.init){
			params.init = function () {
				//alert(cts(this) + ' : init');
				if(this.pre_init)this.pre_init();
				if(this.data.energy || this.data.energy === 0)this.networkData.putInt('energy', this.data.energy);
				if(!this.data.createdCalled) {
					this.data.NETWORK_ID = 'f';
					this.setActive(false);
				} else {
					var controller = searchController(this);
					if (controller) {
						var tile = World.getTileEntity(controller.x, controller.y, controller.z, this.data.blockSource);
						if (tile) {
							tile.updateControllerNetwork();
							//if (this.post_created) this.post_created();
						}
					}
				}
				this.networkData.putInt('NETWORK_ID', this.data.NETWORK_ID >= 0 ? this.data.NETWORK_ID : -1);
				this.data.block_data = this.blockSource.getBlockData(this.x, this.y, this.z);
				this.blockInfo.data = this.data.block_data;
				this.networkData.putInt('block_data', this.data.block_data);
				this.networkData.putBoolean('isActive', this.data.isActive || false);
				//if(this.refreshModel)this.refreshModel();
				var tile = this;
				this.container.addServerOpenListener({
					onOpen: function(container, client){
						if(tile.onWindowOpen){
							tile.onWindowOpen(container, client);
						}
					}
				})
				this.container.addServerCloseListener({
					onClose: function(container, client){
						if(tile.onWindowClose){
							tile.onWindowClose(container, client);
						}
					}
				})
				if(this.post_init)this.post_init();
				this.data.createdCalled = false;
				this.networkData.sendChanges();
			}
		}
		if (!params.update_network) {
			params.update_network = function (net_id, _first) {
				if (this.pre_update_network) if(this.pre_update_network(net_id)) return true;
				if(net_id == 'f' && RSNetworks[this.data.NETWORK_ID] && (netElement = RSNetworks[this.data.NETWORK_ID][cts(this)]) && netElement.id == this.blockInfo.id) delete RSNetworks[this.data.NETWORK_ID][cts(this)];
				this.data.NETWORK_ID = net_id;
				this.networkData.putInt('NETWORK_ID', net_id != 'f' ? net_id : -1);
				if (net_id != "f" && RSNetworks[net_id]) {
					var coords_this = {
						x: this.x,
						y: this.y,
						z: this.z
					}
					RSNetworks[net_id][cts(this)] = {
						id: this.blockInfo.id,
						coords: coords_this,
						isActive: this.data.isActive || false
					}
				}
				if(!_first)this.setActive(net_id != "f");
				this.networkData.sendChanges();
				if (this.post_update_network) this.post_update_network(net_id);
			}
		}
		if (!params.created) {
			params.created = function () {
				//alert(cts(this) + ' : created');
				//this.data.block_data = this.blockSource.getBlockData(this.x, this.y, this.z);
				this.data.createdCalled = true;
				if (this.pre_created) this.pre_created();
				/* var controller = searchController(this);
				if (controller) {
					var tile = World.getTileEntity(controller.x, controller.y, controller.z, this.data.blockSource);
					if (tile) {
						tile.updateControllerNetwork();
						if (this.post_created) this.post_created();
					}
				} */
			}
		}
		if (!params.setActive) {
			params.setActive = function (state, forced, preventRefreshModel) {
				state = this.data.NETWORK_ID != "f" ? !!state : false;
				if(this.data.isActive == state) return false;
				if (this.pre_setActive) if(this.pre_setActive(state)) return false;
				if(state && !this.redstoneAllowActive(this.data.last_redstone_event)) return false;
				if(state == false || (forced || (!this.data.controllerOff && this.data.allowSetIsActive != false))){
					this.data.isActive = state;
					this.networkData.putBoolean('isActive', state);
					if(this.data.NETWORK_ID != "f")RSNetworks[this.data.NETWORK_ID][this.coords_id()].isActive = state
					this.networkData.sendChanges();
					if(this.refreshModel && !preventRefreshModel)this.refreshModel();
					if (this.post_setActive) this.post_setActive(state);
					if(this.refreshGui && !this.setActiveNotUpdateGui)this.refreshGui();
					return true;
				}
			}
		}
		if(!params.redstone){
			params.redstone = function (params) {
				this.data.last_redstone_event = params;
				if(!this.data.redstone_mode) return;
				if(this.redstoneAllowActive(params)){
					this.setActive(true);
				} else {
					this.setActive(false);
				}
				if (this.post_redstone) this.post_redstone(state);
			}
		}
		if(!params.redstoneAllowActive){
			params.redstoneAllowActive = function (params) {
				if(!this.data.redstone_mode) return true;
				if (params.power > 0){
					if(this.data.redstone_mode == 1){
						return true;
					} else if(this.data.redstone_mode == 2){
						return false;
					}
				} else {
					if(this.data.redstone_mode == 1){
						return false;
					} else if(this.data.redstone_mode == 2){
						return true;
					}
				}
			}
		}
		if(!params.refreshRedstoneMode){
			params.refreshRedstoneMode = function () {
				if(this.data.redstone_mode == 0){
					return this.setActive(true);
				} else if(this.redstoneAllowActive(this.data.last_redstone_event)){
					return this.setActive(true);
				} else {
					return this.setActive(false);
				}
			}
		}
		if(!params.coords_id){
			params.coords_id = function () {
				return this.x + ',' + this.y + ',' + this.z;
			}
		}
		if(!params.destroy){
			params.destroy = function(){
				if(this.pre_destroy) this.pre_destroy();
				if(this.data.NETWORK_ID != 'f' && RSNetworks[this.data.NETWORK_ID]) delete RSNetworks[this.data.NETWORK_ID][cts(this)];
				this.data.NETWORK_ID = 'f';
				//BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
				if(this.post_destroy) this.post_destroy();
			}
		}
		if(!params.isWorkAllowed){
			params.isWorkAllowed = function(){
				if(this.data.NETWORK_ID == "f" || !RSNetworks[this.data.NETWORK_ID] || !this.data.isActive) return false;
				return true;
			}
		}
		if(!params.containerEvents) params.containerEvents = {};
		if(!params.containerEvents.updateRedstoneMode)params.containerEvents.updateRedstoneMode = function(eventData, connectedClient) {
			if(this.data.redstone_mode == undefined) this.data.redstone_mode = 0;
			this.data.redstone_mode = this.data.redstone_mode >= 2 ? 0 : this.data.redstone_mode + 1;
			if(!this.refreshRedstoneMode() && this.refreshGui) this.refreshGui();
		}
		this.paramsMap[id] = params;
		TileEntity.registerPrototype(id, params);
	},
	copy: function(id1, id2, params){
		RSgroup.add(id2, -1);
		if(!this.paramsMap[id1]) throw '[RefinedStorageError - RefinedStorage.copy] TileEntity with this id is not registered';
		var params1 = Object.assign({}, this.paramsMap[id1]);
		delete params1.tick;
		TileEntity.registerPrototype(id2, Object.assign(params1, params));
	},
	mapTexture: function (coords, texture, meta) {
		meta = meta || 0;
		if (typeof (texture) == 'string') {
			var _texture = [];
			for (var i = 0; i < 6; i++) _texture.push([texture, meta]);
			texture = _texture;
		}
		var render = new ICRender.Model();
		var model = BlockRenderer.createTexturedBlock(texture);
		render.addEntry(model);
		BlockRenderer.mapAtCoords(coords.x, coords.y, coords.z, render);
	},
	createMapBlock: function (name, params, types) {
		Block.createBlock(name, params, types);
		for (var i in params) {
			var texture = params[i].texture;
			var render = new ICRender.Model();
			var model = BlockRenderer.createTexturedBlock(texture);
			render.addEntry(model);
			ItemModel.getFor(BlockID[name], i).setModel(render);
			BlockRenderer.enableCoordMapping(BlockID[name], i, render);
		}
	}
}

function testButtons(elementsS_, initFunc_){
	if(!Config.dev) return;
	var UIHeight = Number(UI.getScreenHeight());
	var y = 20;//562-80-50;
	var start_x = 630;//400 + 200;
	elementsS_['fps'] = {
		type: "fps", 
		x: 10,
		y: 10,
		z: 5
	}
	elementsS_["testButton0"] = {
		type: "button",
		x: start_x,
		y: y,
		z: 100,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale:2,
		clicker: {
			onClick: function (itemContainerUiHandler, itemContainer, element) {
				UIHeight -= 100;
				//elementsS_['testText2'].text = UIHeight + '';
				itemContainerUiHandler.setBinding('testText2', 'text', UIHeight + '');
				UI.getScreenHeight = function(){
					return UIHeight;
				}
				initFunc_();
			},
			onLongClick: function (itemContainerUiHandler, itemContainer, element) {
			}
		}
	}
	elementsS_["testButton1"] = {
		type: "button",
		x: start_x + 50,
		y: y,
		z: 100,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale:2,
		clicker: {
			onClick: function (itemContainerUiHandler, itemContainer, element) {
				UIHeight -= 10;
				itemContainerUiHandler.setBinding('testText2', 'text', UIHeight + '');
				UI.getScreenHeight = function(){
					return UIHeight;
				}
				initFunc_();
			},
			onLongClick: function (itemContainerUiHandler, itemContainer, element) {
			}
		}
	}
	elementsS_['testText2'] = {
		type: "text",
		x: start_x + 100,
		y: y + 5,
		z: 100,
		text: UI.getScreenHeight() + ''
	}
	elementsS_["testButton3"] = {
		type: "button",
		x: start_x + 180,
		y: y,
		z: 100,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale:2,
		clicker: {
			onClick: function (itemContainerUiHandler, itemContainer, element) {
				UIHeight += 10;
				itemContainerUiHandler.setBinding('testText2', 'text', UIHeight + '');
				UI.getScreenHeight = function(){
					return UIHeight;
				}
				initFunc_();
			},
			onLongClick: function (itemContainerUiHandler, itemContainer, element) {
			}
		}
	}
	elementsS_["testButton4"] = {
		type: "button",
		x: start_x + 230,
		y: y,
		z: 100,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale:2,
		clicker: {
			onClick: function (itemContainerUiHandler, itemContainer, element) {
				UIHeight += 100;
				itemContainerUiHandler.setBinding('testText2', 'text', UIHeight + '');
				UI.getScreenHeight = function(){
					return UIHeight;
				}
				initFunc_();
			},
			onLongClick: function (itemContainerUiHandler, itemContainer, element) {
			}
		}
	}
}