const DISPLAY = UI.getContext().getWindow().getWindowManager().getDefaultDisplay();
const WorkbenchRecipes = WRAP_JAVA('com.zhekasmirnov.innercore.api.mod.recipes.workbench.WorkbenchRecipeRegistry');
const WorkbenchFieldAPI = WRAP_JAVA('com.zhekasmirnov.innercore.api.mod.recipes.workbench.WorkbenchFieldAPI');
const zhekaCompiler = WRAP_JAVA('com.zhekasmirnov.innercore.mod.executable.Compiler');

IMPORT("EnergyNet");

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
	for (var i in Network[net_id]) {
		if (i != 'info' && Network[net_id][i].id == BlockID.RS_controller) return Network[net_id][i].coords;
	}
}

function set_net_for_blocks(_coords, net_id, _self, _first, _defaultActive) {
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
			var bck = World.getBlock(coordss.x, coordss.y, coordss.z);
			var isRsBlock = (RS_blocks.indexOf(bck.id) != -1);
			if (bck.id == BlockID.RS_controller) {
				World.destroyBlock(coordss.x, coordss.y, coordss.z, true);
				continue;
			} else if (bck.id == BlockID.RS_cable) {
				if(net_id != 'f' && Network[net_id]){
					Network[net_id][cts(coordss)] = {
						id: BlockID.RS_cable,
						coords: coordss,
						isActive: true
					}
				} else {
					cableDeleting.push(cts(coordss));
				}
				_search(coordss);
			} else if (isRsBlock) {
				var tile = World.getTileEntity(coordss.x, coordss.y, coordss.z) || World.addTileEntity(coordss.x, coordss.y, coordss.z);
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
		var bck = World.getBlock(_coords.x, _coords.y, _coords.z);
		var isRsBlock = RS_blocks.indexOf(bck.id) != -1;
		if (isRsBlock && bck.id != BlockID.RS_controller) {
			if (bck.id == BlockID.RS_cable) {
				if(net_id != 'f' && Network[net_id]){
					Network[net_id][cts(_coords)] = {
						id: BlockID.RS_cable,
						coords: _coords,
						isActive: true
					}
				} else {
					cableDeleting.push(cts(_coords));
				}
			} else {
				var tile = World.getTileEntity(_coords.x, _coords.y, _coords.z) || World.addTileEntity(_coords.x, _coords.y, _coords.z);
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
		for(var i in Network){
			for(var k in cableDeleting){
				if(Network[i][cableDeleting[k]]) delete Network[i][cableDeleting[k]];
			}
		}
	}
}

function set_is_active_for_blocks(_coords, _state, isController) {
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
			var bck = World.getBlock(coordss.x, coordss.y, coordss.z);
			if (bck.id == BlockID.RS_controller) {
				continue;
			} else if (RS_blocks.indexOf(bck.id) != -1) {
				var tile = World.getTileEntity(coordss.x, coordss.y, coordss.z);
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

function set_is_active_for_blocks_net(net_id, _state, isController) {
	for(var i in Network[net_id]){
		if(i != 'info' && Network[net_id][i].id != BlockID.RS_controller){
			var tile = World.getTileEntity(Network[net_id][i].coords.x, Network[net_id][i].coords.y, Network[net_id][i].coords.z);
			if (tile) {
				if(isController) tile.data.controllerOff = !_state;
				tile.setActive(_state);
			}
		}
	}
}

function checkAndSetNetOnCoords(coords){
	if(!searchController(coords, true))set_net_for_blocks(coords, 'f', true);
}

function searchBlocksInNetwork(net_id, id){
	var res = [];
	if(!Network[net_id]) return res;
	for(var i in Network[net_id]){
		if(Network[net_id][i] && Network[net_id][i].id == id){
			res.push(Network[net_id][i]);
		}
	}
	return res;
}

function getItemUid(item){
	return item.id + '_' + item.data + (item.extra ? '_' + item.extra.getValue() : '');
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

var Network = [];

/* setInterval(function(){
	alert(JSON.stringify(Network, null, '\t'));
}, 60) */

const RS_blocks = [];

Callback.addCallback('DestroyBlock', function(coords, block){
	if (block.id == BlockID.RS_cable) {
		for(var i in Network){
			if(Network[i][cts(coords)]) delete Network[i][cts(coords)];
		}
	}
	if(block.id != BlockID.RS_controller && RS_blocks.indexOf(block.id) != -1)for(var i in sides){
		var zCoords = {
			x: coords.x + sides[i][0],
			y: coords.y + sides[i][1],
			z: coords.z + sides[i][2]
		}
		checkAndSetNetOnCoords(zCoords);
	}
})

const EnergyUse = {}

var temp_data = {};

Callback.addCallback("LevelLeft", function () {
	temp_data = {};
	Network = [];
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
		if(!params.init){
			params.init = function () {
				if(!this.data.createdCalled) this.data.NETWORK_ID = 'f';
				this.data.block_data = World.getBlock(this.x, this.y, this.z).data;
				if(this.refreshModel)this.refreshModel();
				if(this.post_init)this.post_init();
				this.data.createdCalled = false;
			}
		}
		if (!params.update_network) {
			params.update_network = function (net_id, _first) {
				if (this.pre_update_network) if(this.pre_update_network(net_id)) return true;
				if(net_id == 'f' && Network[this.data.NETWORK_ID] && (netElement = Network[this.data.NETWORK_ID][cts(this)]) && netElement.id == this.blockInfo.id) delete Network[this.data.NETWORK_ID][cts(this)];
				this.data.NETWORK_ID = net_id;
				if (net_id != "f" && Network[net_id]) {
					var coords_this = {
						x: this.x,
						y: this.y,
						z: this.z
					}
					Network[net_id][cts(this)] = {
						id: this.blockInfo.id,
						coords: coords_this,
						isActive: this.data.isActive || false
					}
				}
				if(!_first)this.setActive(net_id != "f");
				if (this.post_update_network) this.post_update_network(net_id);
			}
		}
		if (!params.created) {
			params.created = function () {
				this.data.createdCalled = true;
				if (this.pre_created) this.pre_created();
				var controller = searchController(this);
				if (controller) {
					var tile = World.getTileEntity(controller.x, controller.y, controller.z);
					if (tile) {
						tile.updateControllerNetwork();
						if (this.post_created) this.post_created();
					}
				}
			}
		}
		if (!params.setActive) {
			params.setActive = function (state, forced) {
				state = !!state;
				if(this.data.isActive == state) return;
				if (this.pre_setActive) if(this.pre_setActive(state)) return;
				if(state && !this.redstoneAllowActive(this.data.last_redstone_event)) return;
				if(state == false || (forced || (!this.data.controllerOff && this.data.allowSetIsActive != false))){
					this.data.isActive = state;
					if(this.data.NETWORK_ID != "f")Network[this.data.NETWORK_ID][this.coords_id()].isActive = state
				}
				if(this.refreshModel)this.refreshModel();
				if (this.post_setActive) this.post_setActive(state);
				if(this.refreshPageFull)this.refreshPageFull();
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

				} else if(this.redstoneAllowActive(this.data.last_redstone_event)){
					this.setActive(true);
				} else {
					this.setActive(false);
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
				if(this.data.NETWORK_ID != 'f' && Network[this.data.NETWORK_ID]) delete Network[this.data.NETWORK_ID][cts(this)];
				if(this.post_destroy) this.post_destroy();
			}
		}
		this.paramsMap[id] = params;
		TileEntity.registerPrototype(id, params);
	},
	copy: function(id1, id2, params){
		RSgroup.add(id2, -1);
		if(!this.paramsMap[id1]) throw '[RefinedStorageError RefinedStorage.copy] TileEntity with this id is not registered';
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
	var y = 562-80-50;
	elementsS_["testButton0"] = {
		type: "button",
		x: 400 + 200,
		y: y,
		z: 100,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale:2,
		clicker: {
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				UIHeight -= 100;
				elementsS_['testText2'].text = UIHeight + '';
				UI.getScreenHeight = function(){
					return UIHeight;
				}
				initFunc_();
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
			}
		}
	}
	elementsS_["testButton1"] = {
		type: "button",
		x: 450 + 200,
		y: y,
		z: 100,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale:2,
		clicker: {
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				UIHeight -= 10;
				elementsS_['testText2'].text = UIHeight + '';
				UI.getScreenHeight = function(){
					return UIHeight;
				}
				initFunc_();
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
			}
		}
	}
	elementsS_['testText2'] = {
		type: "text",
		x: 490 + 200,
		y: y,
		z: 100,
		text: UI.getScreenHeight() + ''
	}
	elementsS_["testButton3"] = {
		type: "button",
		x: 550 + 200,
		y: y,
		z: 100,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale:2,
		clicker: {
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				UIHeight += 10;
				elementsS_['testText2'].text = UIHeight + '';
				UI.getScreenHeight = function(){
					return UIHeight;
				}
				initFunc_();
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
			}
		}
	}
	elementsS_["testButton4"] = {
		type: "button",
		x: 600 + 200,
		y: y,
		z: 100,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale:2,
		clicker: {
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				UIHeight += 100;
				elementsS_['testText2'].text = UIHeight + '';
				UI.getScreenHeight = function(){
					return UIHeight;
				}
				initFunc_();
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
			}
		}
	}
}