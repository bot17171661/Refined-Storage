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
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				if(tileEntity.data.redstone_mode == undefined) tileEntity.data.redstone_mode = 0;
				tileEntity.data.redstone_mode = tileEntity.data.redstone_mode >= 2 ? 0 : tileEntity.data.redstone_mode + 1;
				elementsGUI_dd["image_redstone"].bitmap = 'redstone_GUI_' + tileEntity.data.redstone_mode;
				tileEntity.refreshRedstoneMode();
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
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
				tileEntity.data.access_type = tileEntity.data.access_type >= 2 ? 0 : tileEntity.data.access_type + 1;
				elementsGUI_dd["image_access_type"].bitmap = 'RS_dd_access_' + tileEntity.data.access_type;
				tileEntity.refreshRedstoneMode();
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
testButtons(elementsGUI_dd, initDDelements);

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
	getTextItemsWidth: function(){
		return 0;
	},
	post_init: function(){
		if(!this.data.disks_percents)this.data.disks_percents = [];
		var elementIns = diskDriveGUI.getWindow('main').getContentProvider().elementMap.get('items');
		var clazz = elementIns.getClass();
		var field = clazz.getDeclaredField("textBounds");
		field.setAccessible(true);
		this.getTextItemsWidth = function(){
			return field.get(elementIns).width();
		}
	},
	post_setActive: function(state){
		if(this.data.NETWORK_ID != "f")Network[this.data.NETWORK_ID].info.updateItems();
	},
	click: function () {
		if (Entity.getSneaking(Player.get())) return false;
		if(this.container.isOpened()) return true;
		this.container.openAs(diskDriveGUI);
		var content = this.container.getGuiContent();
		content.elements["image_redstone"].bitmap = 'redstone_GUI_' + (this.data.redstone_mode || 0);
		content.elements["image_access_type"].bitmap = 'RS_dd_access_' + this.data.access_type;
		return true;
	},
	tick: function () {
		if(this.data.refreshModel){
			this.refreshModel();
			this.data.refreshModel = false;
		}
		if (this.data.NETWORK_ID == "f" || !this.data.isActive) return;
		var storage = 0;
		var disks = 0;
		var stored = 0;
		for (var i = 0; i < 8; i++) {
			var item = this.container.getSlot('slot' + i);
			var lastDiskPercent = this.data.disks_percents[i];
			if (!Disk.items[item.id]) {
				if(lastDiskPercent != undefined)this.data.refreshModel = true;
				delete this.data.disks_percents[i];
				continue;
			}
			if (item.data == 0) item.data = DiskData.length;
			var disk_data = Disk.getDiskData(item);
			var diskPercent = disk_data.items_stored/disk_data.storage;
			if(lastDiskPercent == undefined || ((lastDiskPercent < 0.75 && diskPercent >= 0.75) || (lastDiskPercent >= 0.75 && diskPercent < 0.75) || (lastDiskPercent < 1 && diskPercent >= 1)))this.data.refreshModel = true;
			disks++;
			storage += disk_data.storage;
			stored += disk_data.items_stored;
			this.data.disks_percents[i] = diskPercent;
		}
		if(this.data.disks != disks || this.data.storage != storage || this.data.stored != stored) Network[this.data.NETWORK_ID].info.updateItems();
		this.data.disks = disks;
		this.data.storage = String(storage);
		this.data.stored = stored;
		if (this.container.isOpened()) {
			this.container.setScale('scale', stored == 0 ? 0 : stored / storage);
			this.container.setText('percents', stored == 0 ? '0%' : Math.ceil(stored / (storage / 100)) + '%');
			this.container.setText('items', (stored > 999 ? (stored > 999999 ? ((stored2 = (stored/1000000))%1 ? stored2.toFixed(1) : stored2) + 'M' : ((stored2 = (stored/1000))%1 ? stored2.toFixed(1) : stored2) + 'K') : stored) + (storage != Infinity ? '/' + (storage > 999 ? (storage > 999999 ? ((storage2 = (storage/1000000))%1 ? storage2.toFixed(1) : storage2) + 'M' : ((storage2 = (storage/1000))%1 ? storage2.toFixed(1) : storage2) + 'K') : storage) : ''));
			var element = this.container.getElement('items');
			if(element)element.setPosition(Math.max(elementsGUI_dd['items'].start_x - this.getTextItemsWidth()/2, elementsGUI_dd['scale'].x), elementsGUI_dd['items'].y);
		}
	},
	post_update_network: function(net_id){
	},
	refreshModel: function(){
		var disks_data = [];
		for (var i = 0; i < 8; i++) {
			var item2 = this.container.getSlot('slot' + i);
			if (!Disk.items[item2.id]) {
				disks_data.push({id: 0, data: 0, storage: 0, items_stored: 0});
				continue;
			}
			var disk_data = Disk.getDiskData(item2);
			disks_data.push({id: item2.id, data: item2.data, storage: disk_data.storage, items_stored: disk_data.items_stored});
		}
		mapDisks(this, this.data.block_data, disks_data, this.data.isActive);
	},
	getItems: function () {
		if (this.data.NETWORK_ID == "f" || !this.data.isActive) return {};
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
	destroy: function () {
		if (this.data.NETWORK_ID != "f" && Network[this.data.NETWORK_ID]) {
			this.data.LAST_NETWORK_ID = this.data.NETWORK_ID;
			var str = this.x + ',' + this.y + ',' + this.z;
			delete Network[this.data.NETWORK_ID][str];
		}
	},
	pushItem: function (item) {
	},
	addItem: function (item, count) {
	},
	deleteItem: function (item, count) {
	},
	searchItem: function (item) {
	}
})