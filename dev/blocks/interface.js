IDRegistry.genBlockID("RS_interface");
RefinedStorage.createMapBlock("RS_interface", [
	{
		name: "Interface",
		texture: [
			["interface_off", 0]
		],
		inCreative: true
	}
]);
mod_tip(BlockID['RS_interface']);
RS_blocks.push(BlockID.RS_interface);
EnergyUse[BlockID['RS_interface']] = Config.energy_uses.interface;

var elementsGUI_interface = {};
var interfaceData = {
	getSelectedSlot: function(){}
};
function initInterfaceElements(){

	var slotsSize = 60;
	var x = 375

	var screenHeight = UI.getScreenHeight() - 120;
	var freeSpace = screenHeight - slotsSize*3;
	var numFreeSpace = freeSpace*0.53;
	var num1Space = numFreeSpace/2;
	var arrowSpace = freeSpace*0.47;

	elementsGUI_interface["interface_import_text"] = {
		type: "text",
		x: x,
		y: 20 + num1Space*0.3125,
		text: Translation.translate('Interface Import'),
		z: 10,
		font: {
			color: android.graphics.Color.DKGRAY,
			size: num1Space*0.4375/1.1,
			shadow: 0
		}
	}

	for(var i = 0; i < 9; i++){
		elementsGUI_interface["slot_input" + i] = {
			type: "slot",
			num: i,
			name: "slot_input" + i,
			x: x + i*slotsSize,
			y: 20 + num1Space,
			size: slotsSize
		}
	}

	elementsGUI_interface["interface_export_text"] = {
		type: "text",
		x: x,
		y: elementsGUI_interface["slot_input" + 0].y + slotsSize + num1Space*0.3125,
		text: Translation.translate('Interface Export'),
		z: 10,
		font: {
			color: android.graphics.Color.DKGRAY,
			size: num1Space*0.4375/1.1,
			shadow: 0
		}
	}

	for(var i = 0; i < 9; i++){
		elementsGUI_interface["slot_import" + i] = {
			type: "slot",
			num: i,
			name: "slot_import" + i,
			x: x + i*slotsSize,
			y: elementsGUI_interface["slot_input" + 0].y + slotsSize + num1Space,
			size: slotsSize
		}
	}

	elementsGUI_interface["arrow_image"] = {
		type: "image",
		x: x + slotsSize * 4.5,
		y: elementsGUI_interface["slot_import" + 0].y + slotsSize,
		z: 10,
		bitmap: "RS_arrow",
		scale: Math.min((arrowSpace * 0.8)/44, 2.5)
	}
	elementsGUI_interface["arrow_image"].y += (arrowSpace - elementsGUI_interface["arrow_image"].scale*44)/2;
	elementsGUI_interface["arrow_image"].x -= elementsGUI_interface["arrow_image"].scale*30/2;

	for(var i = 0; i < 9; i++){
		elementsGUI_interface["slot_output" + i] = {
			type: "slot",
			num: i,
			name: "slot_output" + i,
			x: x + i*slotsSize,
			y: elementsGUI_interface["slot_import" + 0].y + slotsSize + arrowSpace,
			size: slotsSize
		}
	}

	var settings_cons = 10;
	elementsGUI_interface["redstone_button"] = {
		type: "button",
		x: 225 + 20 + settings_cons,
		y: 40,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale: 2,
		clicker: {
			onClick: function (itemContainerUiHandler, container, element) {
				container.sendEvent("updateRedstoneMode", {});
			},
			onLongClick: function (itemContainerUiHandler, container, element) {

			}
		}
	}

	elementsGUI_interface["image_redstone"] = {
		type: "image",
		x: elementsGUI_interface["redstone_button"].x,
		y: elementsGUI_interface["redstone_button"].y,
		z: 1000,
		bitmap: "redstone_GUI_0",
		scale: elementsGUI_interface["redstone_button"].scale*20/16
	}

	elementsGUI_interface["damage_button"] = {
		type: "button",
		x: elementsGUI_interface["redstone_button"].x,
		y: elementsGUI_interface["redstone_button"].y + elementsGUI_interface["redstone_button"].scale*20 + settings_cons,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale: 2,
		clicker: {
			onClick: function (itemContainerUiHandler, container, element) {
				container.sendEvent("updateDamage", {});
			},
			onLongClick: function (itemContainerUiHandler, container, element) {
			}
		}
	}

	elementsGUI_interface["image_damage"] = {
		type: "image",
		x: elementsGUI_interface["damage_button"].x,
		y: elementsGUI_interface["damage_button"].y,
		z: 1000,
		bitmap: "RS_damage_on",
		scale: elementsGUI_interface["damage_button"].scale*20/16
	}

	elementsGUI_interface["nbt_button"] = {
		type: "button",
		x: elementsGUI_interface["damage_button"].x,
		y: elementsGUI_interface["damage_button"].y + elementsGUI_interface["damage_button"].scale*20 + settings_cons,
		bitmap: 'RS_empty_button',
		bitmap2: 'RS_empty_button_pressed',
		scale: 2,
		clicker: {
			onClick: function (itemContainerUiHandler, container, element) {
				container.sendEvent("updateUseNbt", {});
			},
			onLongClick: function (itemContainerUiHandler, container, element) {
			}
		}
	}

	elementsGUI_interface["image_nbt"] = {
		type: "image",
		x: elementsGUI_interface["nbt_button"].x,
		y: elementsGUI_interface["nbt_button"].y,
		z: 1000,
		bitmap: "RS_nbt_on",
		scale: elementsGUI_interface["nbt_button"].scale*20/16
	}

	var upgradesYstart = elementsGUI_interface["nbt_button"].y + elementsGUI_interface["nbt_button"].scale*20 + slotsSize*0.25;
	var upgradesYend = elementsGUI_interface["slot_output0"].y + slotsSize*0.75;
	var upgradesSlotsSize = (upgradesYend - upgradesYstart)/4;
	for(var i = 0; i < 4; i++){
		elementsGUI_interface["slot_upgrades" + i] = {
			type: "slot",
			num: i,
			name: "slot_upgrades" + i,
			x: elementsGUI_interface["nbt_button"].x,
			y: upgradesYstart + i*upgradesSlotsSize,
			size: upgradesSlotsSize + 1
		}
	}
};
initInterfaceElements();

var interfaceGUI = new UI.StandartWindow({
	standart: {
		header: {
			text: {
				text: Translation.translate("Interface")
			}
		},
		inventory: {
			width: 300 / 4 * 3
		},
		background: {
			standart: true
		}
	},

	drawing: [],

	elements: elementsGUI_interface
});
GUIs.push(interfaceGUI);

testButtons(interfaceGUI.getWindow('header').getContent().elements, initInterfaceElements);

importSlotsMap = {};
for(var asdl = 0; asdl < 9; asdl++){
	importSlotsMap['slot_import'+asdl] = asdl;
	importSlotsMap[asdl] = 'slot_import'+asdl;
}

var inv_elements_interfaceGUI = interfaceGUI.getWindow('inventory').getContent();

RefinedStorage.createTile(BlockID.RS_interface, {
	defaultValues: {
		ticks: 0,
		currentSlot: 0,
		useDamage: true,
		useNbt: true,
		upgrades: {},
		speed: 9,
		count: 1,
		importItems: [{id:0,data:0,extra:null},{id:0,data:0,extra:null},{id:0,data:0,extra:null},{id:0,data:0,extra:null},{id:0,data:0,extra:null},{id:0,data:0,extra:null},{id:0,data:0,extra:null},{id:0,data:0,extra:null},{id:0,data:0,extra:null}]
	},
	upgradesSlots: ["slot_upgrades0", "slot_upgrades1", "slot_upgrades2", "slot_upgrades3"],
	useNetworkItemContainer: true,
	click: function (id, count, data, coords, player, extra) {
		if(Entity.getSneaking(player)) return false;
		var client = Network.getClientForPlayer(player);
		if (!client || this.container.getNetworkEntity().getClients().contains(client)) return true;
		this.container.openFor(client, "main");
		this.refreshGui(true, client); 
		return true;
	},
	tick: function(){
		StorageInterface.checkHoppers(this);
		for(var k in this.data.importItems){
			var importItem = this.data.importItems[k];
			if(importItem.id == 0) continue;
			var slotItem = this.container.getSlot('slot_output' + k);
			var item = {id: importItem.id, count: importItem.count - slotItem.count, data: this.data.useDamage ? importItem.data : -1, extra: this.data.useNbt ? importItem.extra : -1};
			if(item.count <= 0 || (slotItem.id != importItem.id && slotItem.id != 0) || (slotItem.data != importItem.data && this.data.useDamage) || (slotItem.extra != importItem.extra && this.data.useNbt)) continue;
			var deleted = this.deleteItem(item);
			if(deleted < item.count){
				var count = item.count - deleted;
				this.container.setSlot('slot_output' + k, item.id, slotItem.count + count, item.data, item.extra);
			}
		}
		this.data.ticks++
		if(this.data.ticks%this.data.speed == 0){
			var slot = this.container.getSlot('slot_input' + this.data.currentSlot);
			if(slot.id == 0){
				this.data.currentSlot++;
				if(this.data.currentSlot > 8) this.data.currentSlot = 0;
			} else {
				slot = slot.asScriptable();
				var count = Math.min(slot.count, this.data.count);
				var pushed = this.itemCanBePushed(slot, count, true);
				if(pushed == 0){
					this.container.setSlot('slot_input' + this.data.currentSlot, slot.id, slot.count - count, slot.data, slot.extra);
				} else if(pushed < count){
					this.container.setSlot('slot_input' + this.data.currentSlot, slot.id, slot.count - (count - pushed), slot.data, slot.extra);
				} else {
					this.data.currentSlot++;
					if(this.data.currentSlot > 8) this.data.currentSlot = 0;
					return;
				}
				if(slot.count <= (count - pushed)) this.container.clearSlot('slot_input' + this.data.currentSlot);
				this.pushItem(slot, count);
			}
		}
		this.container.sendChanges();
	},
	/* post_update_network: function(net_id){
		if(net_id == 'f') return;
		var ths = this;
		RSNetworks[net_id][this.coords_id()].pushItemFunc = function(item, count){
			return ths.pushItemFunc(item, count);
		}
	},
	pushItemFunc: function(item, count){
		if(Config.dev)Logger.Log('Redirection item to interface: id: ' + item.id + ', count: ' + count + ' (' + item.count + '), data: ' + item.data + (item.extra ? ', extra: ' + item.extra.getValue() : ''), 'RefinedStorageDebug');
		for(var i in this.data.importItems){
			var _item = this.data.importItems[i];
			if(!_item || _item.id == 0) continue;
			var maxStack = Math.min(Item.getMaxStack(item.id), _item.count);
			var slot = this.container.getSlot('slot_output' + i);
			if(slot.count < maxStack && (item.id == _item.id && (!this.data.useDamage ? true : item.data == _item.data) && (!this.data.useNbt ? true : item.extra == _item.extra) && (slot.id == 0 || (slot.id == item.id && slot.data == item.data && slot.extra == item.extra)))){
				var _count = Math.min(maxStack - count, count);
				if(_count <= 0) continue;
				count -= _count;
				this.container.setSlot('slot_output' + i, item.id, slot.count + _count, item.data, item.extra);
			}
		}
		return count;
	}, */
	pre_created: function(){
		this.data.importItems = [{id:0,data:0,extra:null},{id:0,data:0,extra:null},{id:0,data:0,extra:null},{id:0,data:0,extra:null},{id:0,data:0,extra:null},{id:0,data:0,extra:null},{id:0,data:0,extra:null},{id:0,data:0,extra:null},{id:0,data:0,extra:null}];
	},
	itemCanBePushed: function(item, count, _inverted){
		count = count || item.count;
		if (!this.isWorkAllowed()) return _inverted ? count : 0;
		var res = RSNetworks[this.data.NETWORK_ID].info.itemCanBePushed(item, count);
		return _inverted ? count - res : res;
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
			return {};
		}
		return RSNetworks[this.data.NETWORK_ID].info.just_items_map;
	},
	originalOnlyItemsExtraMap: function(){
		if (!this.isWorkAllowed()) {
			return {};
		}
		return RSNetworks[this.data.NETWORK_ID].info.just_items_map_extra;
	},
    refreshModel: function(){
		if(!this.networkEntity) return Logger.Log(Item.getName(this.blockInfo.id, this.blockInfo.data) + ' model on: ' + cts(this) + ' cannot be displayed');
		this.sendPacket("refreshModel", {isActive: this.data.isActive});
	},
	destroy: function(){
		for(var i = 0; i < 9; i++)this.container.clearSlot('slot_import' + i);
	},
	refreshGui: function(first, client){
		var _data = {
			name: this.networkData.getName() + '', 
			isActive: this.data.isActive, 
			NETWORK_ID: this.data.NETWORK_ID,
			redstone_mode: this.data.redstone_mode,
			refresh: !first,
			isWorkAllowed: this.isWorkAllowed(),
			useNbt: this.data.useNbt,
			useDamage: this.data.useDamage
		};
		if(client){
			this.container.sendEvent(client, "openGui", _data);
		} else {
			this.container.sendEvent("openGui", _data);
		}
	},
	getScreenByName: function(screenName) {
		if(screenName == 'main')return interfaceGUI;
	},
	post_init: function(){
		for(var i = 0; i < 9; i++){
			var ths = this;
			this.container.setSlotAddTransferPolicy('slot_import' + i, {
				transfer: function(itemContainer, slot, id, count, data, extra, player){
					var thisSlot = itemContainer.getSlot(slot);
					ths.data.importItems[importSlotsMap[slot]] = {id: id, count: thisSlot.count + count, data: data, extra: extra};
					itemContainer.setSlot(slot, id, Math.min(thisSlot.count + count, Item.getMaxStack(id)), data, extra);
					return 0;
				}
			})
			this.container.setSlotGetTransferPolicy('slot_import' + i, {
				transfer: function(itemContainer, slot, id, count, data, extra, player){
					ths.data.importItems[importSlotsMap[slot]] = {id:0, count:0, data: 0, extra: null};
					itemContainer.setSlot(slot, 0, 0, 0, null);
					return 0;
				}
			})
			this.container.setSlotAddTransferPolicy('slot_output' + i, {
				transfer: function(itemContainer, slot, id, count, data, extra, player){
					return 0;
				}
			})
		}
	},
	client:{
		refreshModel: function(eventData, packetExtra) {
			if(Config.dev)Logger.Log('Local refreshing Interface model: isActive: ' + this.networkData.getBoolean('isActive'), 'RefinedStorageDebug');
			RefinedStorage.mapTexture(this, this.networkData.getBoolean('isActive') ? 'interface_on' : 'interface_off');
		},
		events: {
			refreshModel: function(eventData, packetExtra) {
				if(Config.dev)Logger.Log('Event refreshing Interface model: isActive: ' + eventData.isActive, 'RefinedStorageDebug');
				RefinedStorage.mapTexture(this, eventData.isActive ? 'interface_on' : 'interface_off');
			}
		},
		containerEvents: {
			openGui: function(container, window, content, eventData){
				if(!content || !window || !window.isOpened()) return;
				content.elements["image_redstone"].bitmap = 'redstone_GUI_' + (eventData.redstone_mode || 0);
				content.elements["image_damage"].bitmap = eventData.useDamage ? 'RS_damage_on' : 'RS_damage_off';
				content.elements["image_nbt"].bitmap = eventData.useNbt ? 'RS_nbt_on' : 'RS_nbt_off';
				/* var elementIns = window.getElements().get('slot_input0'); 
				var clazz = elementIns.getClass(); 
				var field = clazz.getDeclaredField("currentSelectedSlot");
				field.setAccessible(true);
				interfaceData.getSelectedSlot = function(name){
					return name ? field.get(elementIns).description.name : field.get(elementIns);
				} */
			}
		}
	},
	containerEvents:{
		updateUseNbt: function(eventData, connectedClient) {
			this.data.useNbt = !this.data.useNbt;
			this.refreshGui();
		},
		updateDamage: function(eventData, connectedClient) {
			this.data.useDamage = !this.data.useDamage;
			this.refreshGui();
		}
	}
})

StorageInterface.createInterface(BlockID.RS_interface, {
	slots: {
		"slot_input0": {input: true},
		"slot_input1": {input: true},
		"slot_input2": {input: true},
		"slot_input3": {input: true},
		"slot_input4": {input: true},
		"slot_input5": {input: true},
		"slot_input6": {input: true},
		"slot_input7": {input: true},
		"slot_input8": {input: true},
		"slot_output0": {output: true},
		"slot_output1": {output: true},
		"slot_output2": {output: true},
		"slot_output3": {output: true},
		"slot_output4": {output: true},
		"slot_output5": {output: true},
		"slot_output6": {output: true},
		"slot_output7": {output: true},
		"slot_output8": {output: true}
	}
});