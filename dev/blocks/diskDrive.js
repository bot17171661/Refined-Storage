IDRegistry.genBlockID("diskDrive");
Block.createBlockWithRotation("diskDrive", [
	{
		name: "Disk Drive",
		texture: [
			["disk_drive_bottom", 0], // bottom
			["disk_drive_top", 0], // top
			["disk_drive_side", 0], // back
			["disk_drive", 0], // front
			["disk_drive_side", 0], // left
			["disk_drive_side", 0]  // right
		],
		inCreative: true
	}
]);
mod_tip(BlockID['diskDrive']);
RS_blocks.push(BlockID.diskDrive);
EnergyUse[BlockID['diskDrive']] = Config.energy_uses.diskDrive;

const diskDriveTexture = [
	["disk_drive_bottom", 0], // bottom
	["disk_drive_top", 0], // top
	["disk_drive_side", 0], // back
	["disk_drive", 0], // front
	["disk_drive_side", 0], // left
	["disk_drive_side", 0]  // right
];
const diskDriveTextures = [[diskDriveTexture[0], [diskDriveTexture[1][0], 0], diskDriveTexture[2], diskDriveTexture[3], diskDriveTexture[4], diskDriveTexture[5]], [diskDriveTexture[0], [diskDriveTexture[1][0], 1], diskDriveTexture[3], diskDriveTexture[2], diskDriveTexture[5], diskDriveTexture[4]], [diskDriveTexture[0], [diskDriveTexture[1][0], 2], diskDriveTexture[5], diskDriveTexture[4], diskDriveTexture[2], diskDriveTexture[3]], [diskDriveTexture[0], [diskDriveTexture[1][0], 3], diskDriveTexture[4], diskDriveTexture[5], diskDriveTexture[3], diskDriveTexture[2]]];

const diskDriveLedTextures = function(index, block_data){
	block_data = block_data || 0;
	var sideTexture = "disk_drive_disks";
	if(block_data == 1 || block_data == 3)sideTexture = "reverse_disk_drive_disks";
	return [
		["disk_drive_disks_top", 0], // bottom
		["disk_drive_disks_top", 0], // top
		[sideTexture, index], // back
		[sideTexture, index], // front
		[sideTexture, index], // left
		[sideTexture, index]  // right
	]
}

const diskDriveLedBoxes = [
	[
		[2*(1/16), 14*(1/16), 1, 7*(1/16), 12*(1/16), 1+1*(1/16)],
		[9*(1/16), 14*(1/16), 1, 14*(1/16), 12*(1/16), 1+1*(1/16)],
		[2*(1/16), 11*(1/16), 1, 7*(1/16), 9*(1/16), 1+1*(1/16)],
		[9*(1/16), 11*(1/16), 1, 14*(1/16), 9*(1/16), 1+1*(1/16)],
		[2*(1/16), 8*(1/16), 1, 7*(1/16), 6*(1/16), 1+1*(1/16)],
		[9*(1/16), 8*(1/16), 1, 14*(1/16), 6*(1/16), 1+1*(1/16)],
		[2*(1/16), 5*(1/16), 1, 7*(1/16), 3*(1/16), 1+1*(1/16)],
		[9*(1/16), 5*(1/16), 1, 14*(1/16), 3*(1/16), 1+1*(1/16)]
	],
	[
		[9*(1/16), 14*(1/16), 0, 14*(1/16), 12*(1/16), 0-1*(1/16)],
		[2*(1/16), 14*(1/16), 0, 7*(1/16), 12*(1/16), 0-1*(1/16)],
		[9*(1/16), 11*(1/16), 0, 14*(1/16), 9*(1/16), 0-1*(1/16)],
		[2*(1/16), 11*(1/16), 0, 7*(1/16), 9*(1/16), 0-1*(1/16)],
		[9*(1/16), 8*(1/16), 0, 14*(1/16), 6*(1/16), 0-1*(1/16)],
		[2*(1/16), 8*(1/16), 0, 7*(1/16), 6*(1/16), 0-1*(1/16)],
		[9*(1/16), 5*(1/16), 0, 14*(1/16), 3*(1/16), 0-1*(1/16)],
		[2*(1/16), 5*(1/16), 0, 7*(1/16), 3*(1/16), 0-1*(1/16)]
	],
	[
		[1, 14*(1/16), 9*(1/16), 1+1*(1/16), 12*(1/16), 14*(1/16)],
		[1, 14*(1/16), 2*(1/16), 1+1*(1/16), 12*(1/16), 7*(1/16)],
		[1, 11*(1/16), 9*(1/16), 1+1*(1/16), 9*(1/16), 14*(1/16)],
		[1, 11*(1/16), 2*(1/16), 1+1*(1/16), 9*(1/16), 7*(1/16)],
		[1, 8*(1/16), 9*(1/16), 1+1*(1/16), 6*(1/16), 14*(1/16)],
		[1, 8*(1/16), 2*(1/16), 1+1*(1/16), 6*(1/16), 7*(1/16)],
		[1, 5*(1/16), 9*(1/16), 1+1*(1/16), 3*(1/16), 14*(1/16)],
		[1, 5*(1/16), 2*(1/16), 1+1*(1/16), 3*(1/16), 7*(1/16)]
	],
	[
		[0, 14*(1/16), 2*(1/16), 0-1*(1/16), 12*(1/16), 7*(1/16)],
		[0, 14*(1/16), 9*(1/16), 0-1*(1/16), 12*(1/16), 14*(1/16)],
		[0, 11*(1/16), 2*(1/16), 0-1*(1/16), 9*(1/16), 7*(1/16)],
		[0, 11*(1/16), 9*(1/16), 0-1*(1/16), 9*(1/16), 14*(1/16)],
		[0, 8*(1/16), 2*(1/16), 0-1*(1/16), 6*(1/16), 7*(1/16)],
		[0, 8*(1/16), 9*(1/16), 0-1*(1/16), 6*(1/16), 14*(1/16)],
		[0, 5*(1/16), 2*(1/16), 0-1*(1/16), 3*(1/16), 7*(1/16)],
		[0, 5*(1/16), 9*(1/16), 0-1*(1/16), 3*(1/16), 14*(1/16)]
	]
]

for (var ibc = 0; ibc < 4; ibc++) {
	var render = new ICRender.Model();
	var model = BlockRenderer.createTexturedBlock(diskDriveTextures[ibc]);
	render.addEntry(model);
	BlockRenderer.enableCoordMapping(BlockID["diskDrive"], ibc, render);
}

function getDiskState(stored, capacity) {
	if (stored >= capacity) {
		return 2;
	} else if (stored / capacity >= 0.75) {
		return 1;
	} else {
		return 0;
	}
}

function mapDisks(coords, block_data, disks_data, _off){
	var render = new ICRender.Model();
	var model = BlockRenderer.createTexturedBlock(diskDriveTextures[block_data]);
	for(var k = 0; k < 8; k++){
		if(Disk.items[disks_data[k].id]){
			var led_index = !_off ? 3 : getDiskState(disks_data[k].items_stored, disks_data[k].storage);
			model.addBox(diskDriveLedBoxes[block_data][k][0], diskDriveLedBoxes[block_data][k][1], diskDriveLedBoxes[block_data][k][2], diskDriveLedBoxes[block_data][k][3], diskDriveLedBoxes[block_data][k][4], diskDriveLedBoxes[block_data][k][5], diskDriveLedTextures(led_index, block_data));
		}
	}
	render.addEntry(model);
	BlockRenderer.mapAtCoords(coords.x, coords.y, coords.z, render);
}

var elementsGUI_dd = {};
function initDDelements() {
	var x = 650;
	var y = 90;
	var _y = y + 0;

	elementsGUI_dd["scale"] = {
		type: "scale",
		x: 350,
		y: y,
		direction: 1,
		bitmap: "storage_scale_full",
		overlay: "storage_scale_empty",
		value: 0,
		scale: UI.getScreenHeight()*0.576/72,
		overlayScale: 4,
		onTouchEvent: function(element, event){
			if(event.type != 'CLICK') return;
			var tile = element.window.getContainer().tileEntity;
			alert(numberWithCommas(tile.data.stored) + (tile.data.storage != Infinity ? ' / ' + numberWithCommas(tile.data.storage) : ''));
		}
	};
	elementsGUI_dd["scale"].overlayScale = elementsGUI_dd["scale"].scale;

	var asd = 0;
	var cons = UI.getScreenHeight()*0.576/5;//60;
	y += cons/2;
	for (var k = 0; k < 4; k++) {
		x = 650;
		for (var i = 0; i < 2; i++) {
			elementsGUI_dd['slot' + asd] = {
				type: "slot",
				id: asd,
				x: x,
				y: y,
				z: 10,
				isValid: function (id, count, data, container) {
					var answer = !!Disk.items[id+''];
					return answer;
				},
				size: cons + 1
			}
			asd++;
			x += cons;
		}
		y += cons;
	}

	elementsGUI_dd['items'] = {
		type: "text",
		x: elementsGUI_dd["scale"].x + elementsGUI_dd["scale"].scale*18/2,
		y: 0,
		text: "0/0",
		font: {
			color: android.graphics.Color.WHITE,
			shadow: 0.5,
			size: 20
		}
	}
	elementsGUI_dd['items'].start_x = elementsGUI_dd['items'].x + 0;
	elementsGUI_dd['items'].x -= elementsGUI_dd['items'].font.size*3/2;
	elementsGUI_dd['items'].y = elementsGUI_dd["scale"].y - 10 - elementsGUI_dd['items'].font.size;
	elementsGUI_dd['percents'] = {
		type: "text",
		x: 0,
		y: 0,
		text: "0%",
		font: {
			color: android.graphics.Color.WHITE,
			shadow: 0.45,
			size: 17
		}
	}
	elementsGUI_dd['percents'].x = elementsGUI_dd["scale"].x + elementsGUI_dd["scale"].scale*18/2 - elementsGUI_dd['percents'].font.size;
	elementsGUI_dd['percents'].y = elementsGUI_dd["scale"].y + elementsGUI_dd["scale"].scale*72 + 10;
	var settings_cons = 10;
	elementsGUI_dd["redstone_button"] = {
		type: "button",
		x: 0,
		y: elementsGUI_dd['slot0'].y,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale: cons*0.7/20,
		clicker: {
			onClick: function (itemContainerUiHandler, container, element) {
				container.sendEvent("updateRedstoneMode", {});
			},
			onLongClick: function (itemContainerUiHandler, container, element) {
			}
		}
	}
	elementsGUI_dd["redstone_button"].x = elementsGUI_dd['slot0'].x - settings_cons - (20 * elementsGUI_dd["redstone_button"].scale);

	elementsGUI_dd["image_redstone"] = {
		type: "image",
		x: elementsGUI_dd["redstone_button"].x,
		y: elementsGUI_dd["redstone_button"].y,
		z: 1000,
		bitmap: "redstone_GUI_0",
		scale: elementsGUI_dd["redstone_button"].scale*20/16,
	}

	elementsGUI_dd["access_type_button"] = {
		type: "button",
		x: elementsGUI_dd["redstone_button"].x,
		y: 0,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale: cons*0.7/20,
		clicker: {
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				/* tileEntity.data.access_type = tileEntity.data.access_type >= 2 ? 0 : tileEntity.data.access_type + 1;
				elementsGUI_dd["image_access_type"].bitmap = 'RS_dd_access_' + tileEntity.data.access_type;
				tileEntity.refreshRedstoneMode(); */
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
			}
		}
	}
	elementsGUI_dd["access_type_button"].y = elementsGUI_dd['redstone_button'].y + (20 * elementsGUI_dd["redstone_button"].scale) + settings_cons;

	elementsGUI_dd["image_access_type"] = {
		type: "image",
		x: elementsGUI_dd["access_type_button"].x,
		y: elementsGUI_dd["access_type_button"].y,
		z: 1000,
		bitmap: "RS_dd_access_0",
		scale: elementsGUI_dd["access_type_button"].scale*20/16,
	}
}
initDDelements();

var diskDriveGUI = new UI.StandartWindow({
	standart: {
		header: {
			text: {
				text: Translation.translate("Disk Drive")
			}
		},
		inventory: {
			standart: true
		},
		background: {
			standart: true
		}
	},

	drawing: [],

	elements: elementsGUI_dd
});
GUIs.push(diskDriveGUI);
testButtons(diskDriveGUI.getWindow('header').getContent().elements, initDDelements);

var _ddfont = new JavaFONT(elementsGUI_dd['items'].font);
var getDiskDriveTextItemsWidth = function(){
	var drawScale = diskDriveGUI.getWindow('main').location.getDrawingScale();
	return _ddfont.getBounds(diskDriveGUI.getWindow('main').getElements().get('items').getBinding('text'), elementsGUI_dd['items'].x * drawScale, elementsGUI_dd['items'].y * drawScale, parseFloat(1.0)).width();
};

RefinedStorage.createTile(BlockID.diskDrive, {
	defaultValues: {
		storage: 0,
		stored: 0,
		NETWORK_ID: 'f',
		LAST_NETWORK_ID: 'f',
		disks: 0,
		items: {},
		disks_percents: [],
		block_data: 0,
		refreshModel: false,
		access_type: 0
	},
	useNetworkItemContainer: true,
	post_init: function(){
		if(!this.data.disks_percents)this.data.disks_percents = [];
		this.data.iinit = true;
		this.networkData.putString('slots', JSON.stringify(this.getDiskDatas()));
		this.container.setGlobalAddTransferPolicy({
			transfer: function(itemContainer, slot, id, count, data, extra, player){
				if(!Disk.items[id]) count = 0;
				return count;
			}
		});
	},
	post_setActive: function(state){
		if(this.data.NETWORK_ID != "f")RSNetworks[this.data.NETWORK_ID].info.updateItems();
	},
	click: function (id, count, data, coords, player, extra) {
		if (Entity.getSneaking(player)) return false;
		var client = Network.getClientForPlayer(player);
		if(!client) return true;
		if (this.container.getNetworkEntity().getClients().contains(client)) return true;
		this.container.openFor(client, "main");
		var _data = {
			name: this.networkData.getName() + '', 
			isActive: this.data.isActive, 
			redstone_mode: this.data.redstone_mode, 
			access_type: this.data.access_type
		};
		this.container.sendEvent(client, "openGui", _data); 
		return true;
	},
	getScreenByName: function(screenName) {
		if(screenName == 'main')return diskDriveGUI;
	},
	getDiskDatas: function(){
		var diskDatas = [];
		for (var i = 0; i < 8; i++) {
			var item = this.container.getSlot('slot' + i);
			if (!Disk.items[item.id]) {
				diskDatas.push({id: 0, data: 0, storage: 0, items_stored: 0});
				continue;
			}
			if (item.data == 0) item.data = DiskData.length;
			var disk_data = Disk.getDiskData(item);
			diskDatas.push({id: item.id, data: item.data, storage: disk_data.storage + "", items_stored: disk_data.items_stored});
		}
		return diskDatas;
	},
	tick: function () {
		StorageInterface.checkHoppers(this);
		if(this.data.refreshModel){
			this.refreshModel();
			this.data.refreshModel = false;
		}
		var storage = 0;
		var disks = 0;
		var stored = 0;
		var diskDatas = [];
		for (var i = 0; i < 8; i++) {
			var item = this.container.getSlot('slot' + i);
			var lastDiskPercent = this.data.disks_percents[i];
			if (!Disk.items[item.id]) {
				if(lastDiskPercent != undefined)this.data.refreshModel = true;
				delete this.data.disks_percents[i];
				diskDatas.push({id: 0, data: 0, storage: 0, items_stored: 0});
				continue;
			}
			if (item.data == 0) item.data = DiskData.length;
			var disk_data = Disk.getDiskData(item);
			diskDatas.push({id: item.id, data: item.data, storage: disk_data.storage + "", items_stored: disk_data.items_stored});
			var diskPercent = disk_data.items_stored/disk_data.storage;
			if(lastDiskPercent == undefined || ((lastDiskPercent < 0.75 && diskPercent >= 0.75) || (lastDiskPercent >= 0.75 && diskPercent < 0.75) || (lastDiskPercent < 1 && diskPercent >= 1)))this.data.refreshModel = true;
			disks++;
			storage += disk_data.storage;
			stored += disk_data.items_stored;
			this.data.disks_percents[i] = diskPercent;
		}
		if(this.data.disks != disks || this.data.storage != storage || this.data.stored != stored) {
			if(this.isWorkAllowed() && this.data.disks != disks)RSNetworks[this.data.NETWORK_ID].info.updateItems();
			this.networkData.putString('slots', JSON.stringify(diskDatas));
			this.networkData.sendChanges();
		}
		this.data.disks = disks;
		this.data.storage = String(storage);
		this.data.stored = stored;
		if (this.container.getNetworkEntity().getClients().iterator().hasNext()) {
			this.container.setScale('scale', stored == 0 ? 0 : stored / storage);
			this.container.setText('percents', stored == 0 ? '0%' : Math.ceil(stored / (storage / 100)) + '%');
			this.container.setText('items', cutNumber(stored) + (storage != Infinity ? '/' + cutNumber(storage) : ''));
			this.container.sendChanges();
		}
		return;
	},
	post_update_network: function(net_id){
		if(RSNetworks && RSNetworks[this.data.LAST_NETWORK_ID] && RSNetworks[this.data.LAST_NETWORK_ID].info)RSNetworks[this.data.LAST_NETWORK_ID].info.updateItems();
		if(this.data.iinit && this.isWorkAllowed()){
			RSNetworks[this.data.NETWORK_ID].info.updateItems();
			this.data.iinit = false;
		}
	},
	refreshModel: function(){
		if(!this.networkEntity) return Logger.Log(Item.getName(this.blockInfo.id, this.blockInfo.data) + ' model on: ' + cts(this) + ' cannot be displayed');
		this.sendPacket("refreshModel", {block_data: this.data.block_data, isActive: this.data.isActive, coords: {x: this.x, y: this.y, z: this.z, dimension: this.dimension}});
	},
	refreshGui: function(){
		var _data = {
			name: this.networkData.getName() + '', 
			isActive: this.data.isActive, 
			redstone_mode: this.data.redstone_mode, 
			access_type: this.data.access_type
		};
		this.container.sendEvent("refreshGui", _data);
	},
	getItems: function () {
		if (!this.isWorkAllowed()) return {};
		var items = {};
		for (var i = 0; i < 8; i++) {
			var item2 = this.container.getSlot('slot' + i);
			if (!Disk.items[item2.id+''] || !item2.extra) continue;
			var disk_data = Disk.getDiskData(item2);
			for(var i in disk_data.items){
				items['' + disk_data.items[i].id] = { data: disk_data.items[i].data, count: disk_data.items[i].count, name: Item.getName(disk_data.items[i].id, 0) };
			}
		}
		return items;
	},
	post_destroy: function(){
		if(RSNetworks && RSNetworks[this.data.LAST_NETWORK_ID] && RSNetworks[this.data.LAST_NETWORK_ID].info)RSNetworks[this.data.LAST_NETWORK_ID].info.updateItems();
	},
	client: {
		refreshModel: function(){
			var disks_data = (_data = this.networkData.getString('slots', 'null')) != 'null' ? JSON.parse(_data).map(function(elem){
				if(elem)elem.storage = Number(elem.storage);
				return elem;
			}) : [{id: 0, data: 0, storage: 0, items_stored: 0},{id: 0, data: 0, storage: 0, items_stored: 0},{id: 0, data: 0, storage: 0, items_stored: 0},{id: 0, data: 0, storage: 0, items_stored: 0},{id: 0, data: 0, storage: 0, items_stored: 0},{id: 0, data: 0, storage: 0, items_stored: 0},{id: 0, data: 0, storage: 0, items_stored: 0},{id: 0, data: 0, storage: 0, items_stored: 0}];
			if(Config.dev)Logger.Log('Local refreshing DiskDrive model: block_data: ' + this.networkData.getInt('block_data') + ' ; isActive: ' + this.networkData.getBoolean('isActive') + ' ; disks_data: ' + JSON.stringify(disks_data), 'RefinedStorageDebug');
			mapDisks(this, this.networkData.getInt('block_data') || 0, disks_data, this.networkData.getBoolean('isActive'));
		},
		events: {
			refreshModel: function(eventData, connectedClient){
				var disks_data = (_data = this.networkData.getString('slots', 'null')) != 'null' ? JSON.parse(_data).map(function(elem){
					if(elem)elem.storage = Number(elem.storage);
					return elem;
				}) : [{id: 0, data: 0, storage: 0, items_stored: 0},{id: 0, data: 0, storage: 0, items_stored: 0},{id: 0, data: 0, storage: 0, items_stored: 0},{id: 0, data: 0, storage: 0, items_stored: 0},{id: 0, data: 0, storage: 0, items_stored: 0},{id: 0, data: 0, storage: 0, items_stored: 0},{id: 0, data: 0, storage: 0, items_stored: 0},{id: 0, data: 0, storage: 0, items_stored: 0}];
				if(Config.dev)Logger.Log('Event refreshing DiskDrive model: block_data: ' + eventData.block_data + ' ; isActive: ' + eventData.isActive + ' ; disks_data: ' + JSON.stringify(disks_data), 'RefinedStorageDebug');
				mapDisks(eventData.coords, eventData.block_data, disks_data, eventData.isActive);
			}
		},
		containerEvents: {
			openGui: function(container, window, content, eventData){
				if(!content || !window || !window.isOpened()) return;
				content.elements["image_redstone"].bitmap = 'redstone_GUI_' + (eventData.redstone_mode || 0);
				content.elements["image_access_type"].bitmap = 'RS_dd_access_' + eventData.access_type;
			},
			refreshGui:function(container, window, content, eventData){
				if(!content || !window || !window.isOpened()) return;
				content.elements["image_redstone"].bitmap = 'redstone_GUI_' + (eventData.redstone_mode || 0);
				content.elements["image_access_type"].bitmap = 'RS_dd_access_' + eventData.access_type;
			}
		}
	},
	containerEvents: {

	}
});

Callback.addCallback('LocalTick', function(){
	if(!diskDriveGUI.isOpened()) return;
	var element = diskDriveGUI.getWindow('main').getElements().get('items');
	element.setPosition(Math.max(elementsGUI_dd['items'].start_x - getDiskDriveTextItemsWidth()/2, elementsGUI_dd['scale'].x), elementsGUI_dd['items'].y);
});

StorageInterface.createInterface(BlockID.diskDrive, {
	slots: {
		"slot0": {input: true},
		"slot1": {input: true},
		"slot2": {input: true},
		"slot3": {input: true},
		"slot4": {input: true},
		"slot5": {input: true},
		"slot6": {input: true},
		"slot7": {input: true}
	},
	isValidInput: function(item){
		return !!Disk.items[item.id];
	}
});