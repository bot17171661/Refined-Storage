const DISPLAY = UI.getContext().getWindow().getWindowManager().getDefaultDisplay();
const WorkbenchRecipes = WRAP_JAVA('com.zhekasmirnov.innercore.api.mod.recipes.workbench.WorkbenchRecipeRegistry');
const WorkbenchFieldAPI = WRAP_JAVA('com.zhekasmirnov.innercore.api.mod.recipes.workbench.WorkbenchFieldAPI');
const zhekaCompiler = WRAP_JAVA('com.zhekasmirnov.innercore.mod.executable.Compiler');
const ScriptableObjectHelper = WRAP_JAVA('com.zhekasmirnov.innercore.api.mod.ScriptableObjectHelper');
const JavaFONT = WRAP_JAVA('com.zhekasmirnov.innercore.api.mod.ui.types.Font');
const JavaRect = android.graphics.Rect;
const _setTip = ModAPI.requireGlobal("MCSystem.setLoadingTip");
var RSJava = WRAP_JAVA('com.bot12381.refined.Main');
RSJava = new RSJava();


//Callback.addCallback('LevelLoaded', function(){
	/* var hashSet = new java.util.HashSet();
	WorkbenchRecipes.addRecipesThatContainItem(5, 0, hashSet);
	var it = hashSet.iterator();
	while (it.hasNext()) {
		var jRecipe = it.next();
		var result = jRecipe.getResult();
		alert(Item.getName(result.id, result.data) + ' : ' + result.id + ' : ' + RSJava.isDarkenSlot(jRecipe, {5: [0, 1], 158: [0]}, ['5_0', '158_0']));
	} */
	/* var container = new ItemContainer();
	var items = {};
	var itemsMap = [];
	var onlyItemsMap = {};
	for(var i = 1000; i >= 1; i--){
		var uid = i + '_0';
		items[uid] = {id: i, data: 0, count: 50, extra: null};
		itemsMap.push(uid);
		onlyItemsMap[i] = [0];
		container.setSlot(uid, i, 10, 0);
	} */
	//alert(itemsMap);
	/* var millis = java.lang.System.currentTimeMillis();
	var sorted = RSJava.sortCrafts(items, "-1nullfalse", onlyItemsMap);
	alert('Array sorted on: ' + (java.lang.System.currentTimeMillis() - millis));
	alert(sorted.length);
	var array = ScriptableObjectHelper.createArray(sorted); */
	/* alert(itemsMap);
	var millis = java.lang.System.currentTimeMillis();
	RSJava.sortItems(0, false, container, itemsMap);
	alert('Array sorted on: ' + (java.lang.System.currentTimeMillis() - millis));
	alert(ScriptableObjectHelper.createArray(itemsMap)); */
	/* alert(itemsMap.map(function(value){
		var item_ = container.getSlot(value);
		return Item.getName(item_.id, item_.data);
	}));
	var millis = java.lang.System.currentTimeMillis();
	var sorted = RSJava.sortItems(0, false, 'a', container, itemsMap);
	alert('Array sorted on: ' + (java.lang.System.currentTimeMillis() - millis));
	var array = ScriptableObjectHelper.createArray(sorted);
	alert(array.map(function(value){
		var item_ = container.getSlot(value);
		return Item.getName(item_.id, item_.data);
	})); */
//})

IMPORT("EnergyNet");
IMPORT("StorageInterface");

var Config = {
	reload: function () {
		var reload = Config.reload;
		var write = Config.write;
		Config = FileTools.ReadJSON(__dir__ + 'config.json');
		Config.reload = reload;
		Config.write = write;
	},
	write: function(){
		FileTools.WriteJSON(__dir__ + 'config.json', this, true);
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

/* var EMPTY_SAVER = Saver.registerObjectSaver('THIS_IS_EMPTY_SAVER', {
	read: function(){return null},
	save: function(){return null}
}); */

const searchController = function (_coords, _self, _blockSource) {
	if(!_blockSource) _blockSource = _coords.blockSource;
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
			var bck = _blockSource.getBlock(coordss.x, coordss.y, coordss.z);
			if (bck.id == BlockID.RS_controller) {
				s = coordss;
				return;
			} else if (RS_blocks.indexOf(bck.id) != -1) {
				_search(coordss);
			}
		}
	}
	if(_self){
		var bck = _blockSource.getBlock(_coords.x, _coords.y, _coords.z);
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

function set_net_for_blocks(_coords, net_id, _self, _first, _defaultActive, _forced, _func) {
	if(Config.dev)Logger.Log('Set net for blocks: coords: ' + cts(_coords) + ' ; net_id: ' + net_id + ' ; _self: ' + _self + ' ; _first: ' + _first + ' ; _defaultActive: ' + _defaultActive + ' ; _forced: ' + _forced, 'RefinedStorageDebug');
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
			var bck = blockSource_.getBlock(coordss.x, coordss.y, coordss.z);
			var isRsBlock = (RS_blocks.indexOf(bck.id) != -1);
			if (bck.id == BlockID.RS_controller) {
				if(net_id == 'f') continue;
				if(InnerCore_pack.packVersionCode < 120) blockSource_.destroyBlock(coordss.x, coordss.y, coordss.z, true);
				else blockSource_.breakBlock(coordss.x, coordss.y, coordss.z, true);
                if(InnerCore_pack.packVersionCode <= 110)Block.onBlockDestroyed(coordss, bck, false, Player.get());
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
					if(!_forced && net_id == 'f' && !compareCoords(_coords, tile.data.controller_coords || {})) continue;
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
	if(!(controllerCoords = searchController(coords, true)))set_net_for_blocks(coords, 'f', true, false, undefined, true);
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
	register: function (name, texture, storage, registerItem) {
		for (var i in this.items) {
			if (this.items[i].storage == storage) {
				log('Disk with such storage already exists');
				return  -1;
			}
		}
		var itemIDName = registerItem ? registerItem : "storageDisk" + storage;
		if(registerItem == undefined){
			IDRegistry.genItemID(itemIDName);
			Item.createItem(itemIDName, name, {
				name: texture,
			}, {
				//isTech: true,
				stack: 1
			});
			mod_tip(ItemID[itemIDName]);
		}
		Item.registerNameOverrideFunction(ItemID[itemIDName], function (item, name) {
			var disk_data = DiskData[item.data];
			if(!disk_data) return '§b' + name + "\n§7" + Translation.translate('Stored') + (storage != Infinity ? ': 0/' + storage : ': 0');
			name += "\n§7" + Translation.translate('Stored') + ': ' + disk_data.items_stored + (disk_data.storage != Infinity ? '/' + disk_data.storage : '');
			return name;
		});
		this.items[ItemID[itemIDName]] = { name: name, texture: texture, storage: storage };
		return ItemID[itemIDName];
	},
	update: function (item) {
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

const UpgradeRegistry = {
	upgrades: {},
	stringIDUpgrades: {},
	/**
	 * Register new upgrade
	 * @param {string} name name of upgrade, used as item name, used if registerItem is not defined
	 * @param {string} nameID string id of the item
	 * @param {string} texture texture name, used if registerItem is not defined
	 * @param {object} params upgrade params
	 * @param {number=} params.maxStack maximum amount of this upgrades in mechanism, if not defined then amount is infinity
	 * @param {function(TileEntity, {id: number, count: number, data: number, extra: object}, ItemContainer, string, number)} params.addFunc Called on upgrade added to slot
	 * @param {function(TileEntity, {id: number, count: number, data: number, extra: object}, ItemContainer, string, number)} params.deleteFunc Called on upgrade deleted from slot 
	 * @param {string} usage energy usage
	 * @param {string} registerItem if this parameter is defined then item not created, use it if you want to create your item
	 * @returns {number} return item id
	 */
	register: function(name, nameID, texture, params, usage, registerItem){
		var itemIDName = registerItem ? registerItem : nameID;
		if(!registerItem){
			IDRegistry.genItemID(itemIDName);
			Item.createItem(itemIDName, name, {
				name: texture,
			}, {
				//isTech: true,
				stack: 64
			});
			mod_tip(ItemID[itemIDName]);
		}
		params.nameID = itemIDName;
		params.usage = usage || 0;
		this.upgrades[ItemID[itemIDName]] = params;
		this.stringIDUpgrades[itemIDName] = params;
		return ItemID[itemIDName];
	},
	/**
	 * Get upgrade data
	 * @param {number|string} id item id or string id(nameID) of upgrade
	 * @returns {object|undefined} return upgrade data or undefined if upgrade with this id is not registered
	 */
	getData: function(id){
		var upgrade = this.upgrades[id] || this.stringIDUpgrades[id];
		if(upgrade) return upgrade;
	},
	/**
	 * Get item string id
	 * @param {number|string} id item id or string id(nameID) of upgrade
	 * @returns {string|undefined} return item string id or undefined if upgrade with this id is not registered
	 */
	getNameID: function(id){
		var upgrade = this.upgrades[id] || this.stringIDUpgrades[id];
		if(upgrade) return upgrade.nameID;
	},
	/**
	 * Get upgrade energy usage
	 * @param {number|string} id item id or string id(nameID) of upgrade
	 * @returns {object|undefined} return upgrade energy usage or undefined if upgrade with this id is not registered
	 */
	getEnergyUsage: function(id){
		var upgrade = this.upgrades[id] || this.stringIDUpgrades[id];
		if(upgrade) return upgrade.usage;
		return 0;
	}
}

var itemsNamesMap = {};

const getItemName = function(id, data, extra){
	var item = {id: id, data: data, extra: extra};
	var itemUid = getItemUid(item);
	if(!itemsNamesMap[itemUid]) itemsNamesMap[itemUid] = Item.getName(id, data, extra);
	return itemsNamesMap[itemUid];
}

var RSNetworks = [];

var RSbannedItems = [0];

const RS_blocks = [];
Callback.addCallback('PostLoaded', function(){
	for(var i in RS_blocks)World.setBlockChangeCallbackEnabled(RS_blocks[i], true);
})
World.setBlockChangeCallbackEnabled(535, true);
World.setBlockChangeCallbackEnabled(250, true);
World.setBlockChangeCallbackEnabled(34, true);
var pistonsPoss = [
	[0, -1, 0],
	[0, 1, 0],
	[0, 0, 1],
	[0, 0, -1],
	[1, 0, 0],
	[-1, 0, 0]
]
var pistonsMove__ = {};
var ignoredParams = ['NETWORK_ID','LAST_NETWORK_ID','controller_coords','createdCalled'];
Callback.addCallback('BlockChanged', function(coords, oldBlock, newBlock, _blockSource){
	//alert('Block changed from: ' + oldBlock.id + "|" + oldBlock.data + " ; to: " + newBlock.id + "|" + newBlock.data);
	_blockSource = BlockSource.getDefaultForDimension(_blockSource);
	coords.blockSource = _blockSource;
	if(oldBlock.id == 535 || newBlock.id == 535 || newBlock.id == 34) {
		var pistonBlockData = newBlock.id == 535 || newBlock.id == 34 ? newBlock.data : oldBlock.data;
		var pistonPos = pistonsPoss[pistonBlockData];
		var from_coords = oldBlock.id == 535 ? {
			x: coords.x + pistonPos[0],
			y: coords.y + pistonPos[1],
			z: coords.z + pistonPos[2]
		} : coords;
		var to_coords = newBlock.id == 535 || newBlock.id == 34 ? {
			x: coords.x + pistonPos[0],
			y: coords.y + pistonPos[1],
			z: coords.z + pistonPos[2]
		} : coords;
		var __tile = World.getTileEntity(from_coords.x, from_coords.y, from_coords.z, _blockSource);
		if(__tile){
			pistonsMove__[cts(to_coords)] = __tile;
		}
	}
	if(oldBlock.id == 250) {
		if((oldTileData = pistonsMove__[cts(coords)]) && (newTileData = World.addTileEntity(coords.x, coords.y, coords.z, _blockSource))){
			for(var i in newTileData.data){
				if(ignoredParams.indexOf(i) == -1){
					newTileData.data[i] = oldTileData.data[i];
				}
			}
			var unsaveableSlotsArray = Array.isArray(oldTileData.unsaveableSlots) ? oldTileData.unsaveableSlots : [];
			if(!oldTileData.unsaveableSlots || unsaveableSlotsArray.length > 0)for(var i in oldTileData.container.slots){
				if(unsaveableSlotsArray.length > 0 && unsaveableSlotsArray.indexOf(i) != -1) continue;
				var _slot = oldTileData.container.slots[i];
				newTileData.container.setSlot(i, _slot.id, _slot.count, _slot.data, _slot.extra);
				oldTileData.container.setSlot(i, 0,0,0,null);
			}
			TileEntity.destroyTileEntity(oldTileData);
			delete pistonsMove__[cts(coords)];
		}
	}
	if (oldBlock.id == BlockID.RS_cable) {
		for(var i in RSNetworks){
			if(RSNetworks[i][cts(coords)]) delete RSNetworks[i][cts(coords)];
		}
	}
	var isOldBlock = RS_blocks.indexOf(oldBlock.id) != -1;
	var isNewBlock = RS_blocks.indexOf(newBlock.id) != -1;
	/* if(isNewBlock && newBlock.id != BlockID.RS_cable){
		var _newTile = World.getTileEntity(coords.x, coords.y, coords.z, _blockSource) || World.addTileEntity(coords.x, coords.y, coords.z, _blockSource);
		if(newBlock.id == BlockID.RS_controller && newBlock.data == 3 && _newTile){
			_newTile.data.isCreative = true;
			_newTile.data.energy = Config.controller.energyCapacity;
		}
	} */
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
		if(!params.defaultValues.upgrades)params.defaultValues.upgrades = {};
		if(!params.upgradesSlots)params.upgradesSlots = [];
		if(!params.init){
			params.init = function () {
				//alert(cts(this) + ' : init');
				if(this.pre_init)this.pre_init();
				if(this.data.energy || this.data.energy === 0)this.networkData.putInt('energy', this.data.energy);
				if(!this.data.createdCalled) {
					this.data.NETWORK_ID = 'f';
					this.setActive(false);
				} else {
					var controller = searchController(this, false);
					if (controller) {
						var tile = World.getTileEntity(controller.x, controller.y, controller.z, this.data.blockSource);
						if (tile) {
							tile.data.updateControllerNetwork = true;
							//tile.updateControllerNetwork();
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
				});
				this.container.addServerCloseListener({
					onClose: function(container, client){
						if(tile.onWindowClose){
							tile.onWindowClose(container, client);
						}
					}
				});
				if(this.unsaveableSlots && InnerCore_pack.packVersionCode >= 120){
					if(Array.isArray(this.unsaveableSlots)){
						for(var i in this.unsaveableSlots)this.container.setSlotSavingEnabled(this.unsaveableSlots[i], false);
					} else {
						this.container.setGlobalSlotSavingEnabled(false);
					}
				}
				if(this.upgradesSlots)for(var i in this.upgradesSlots){
					this.container.setSlotAddTransferPolicy(this.upgradesSlots[i], {
						transfer: function(itemContainer, slot, id, count, data, extra, player){
							count = 1;
							if(!(upgrade = UpgradeRegistry.upgrades[id]) || itemContainer.getSlot(slot).id != 0) return 0
							if(tile.data.upgrades[upgrade.nameID]){
								if(upgrade.maxStack && tile.data.upgrades[upgrade.nameID] >= upgrade.maxStack) return 0;
								tile.data.upgrades[upgrade.nameID]++;
							} else {
								tile.data.upgrades[upgrade.nameID] = 1;
							}
							//var networkTile = tile.getNetworkTile();
							//if(networkTile)networkTile.upgrades = tile.data.upgrades;
							if(upgrade.addFunc)upgrade.addFunc(tile, {id: id, count: count, data: data, extra: extra}, itemContainer, slot, player);
							return count;
						}
					})
					this.container.setSlotGetTransferPolicy(this.upgradesSlots[i], {
						transfer: function(itemContainer, slot, id, count, data, extra, player){
							if(!(upgrade = UpgradeRegistry.upgrades[id])) return 0
							if(tile.data.upgrades[upgrade.nameID])tile.data.upgrades[upgrade.nameID]--
							//var networkTile = tile.getNetworkTile();
							//if(networkTile)networkTile.upgrades = tile.data.upgrades;
							if(upgrade.deleteFunc)upgrade.deleteFunc(tile, {id: id, count: count, data: data, extra: extra}, itemContainer, slot, player);
							return count;
						}
					})
				}
				if(this.post_init)this.post_init();
				this.data.createdCalled = false;
				this.networkData.sendChanges();
			}
		}
		if (!params.update_network) {
			params.update_network = function (net_id, _first) {
				if (this.pre_update_network) if(this.pre_update_network(net_id)) return true;
				if(net_id == 'f' && RSNetworks[this.data.NETWORK_ID] && (netElement = RSNetworks[this.data.NETWORK_ID][cts(this)]) && netElement.id == this.blockInfo.id) delete RSNetworks[this.data.NETWORK_ID][cts(this)];
				this.data.LAST_NETWORK_ID = this.data.NETWORK_ID;
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
						upgrades: this.data.upgrades,
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
				if(!this.blockSource)this.blockSource = BlockSource.getDefaultForDimension(this.dimension);
				//alert(cts(this) + ' : created');
				//this.data.block_data = this.blockSource.getBlockData(this.x, this.y, this.z);
				this.data.upgrades = {};
				this.data.createdCalled = true;
				if (this.pre_created) this.pre_created();
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
			params.destroy = function(param1){
				if(this.pre_destroy) this.pre_destroy(param1);
				if(this.data.NETWORK_ID != 'f' && RSNetworks[this.data.NETWORK_ID]) delete RSNetworks[this.data.NETWORK_ID][cts(this)];
				this.data.LAST_NETWORK_ID = this.data.NETWORK_ID;
				this.data.NETWORK_ID = 'f';
				//BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
				if(this.post_destroy) this.post_destroy(param1);
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
		if(!params.getNetworkTile){
			params.getNetworkTile = function () {
				if(this.data.NETWORK_ID != "f" && RSNetworks[this.data.NETWORK_ID] && (answ = RSNetworks[this.data.NETWORK_ID][this.coords_id()])) return answ;
			}
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
};