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

(function(){

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
		multiline: true,
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
			/* clicker: {
				onClick: function (param1_, param2_, param3_) {
					alert('Hi');
				},
				onLongClick: function (param1_, param2_, param3_) {
				}
			}, */
			size: slotsSize
		}
	}

	elementsGUI_interface["interface_export_text"] = {
		type: "text",
		x: x,
		y: elementsGUI_interface["slot_input" + 0].y + slotsSize + num1Space*0.3125,
		text: Translation.translate('Interface Export'),
		z: 10,
		multiline: true,
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
			/* onTouchEvent: function (element, event) {
				if (event.type == 'CLICK') {
					var slot_id = this.name;
					var container = element.window.getContainer();
					var tile = container.tileEntity;
					if(tile.getSelectedSlot && tile.getSelectedSlot(true) == slot_id)container.setSlot(slot_id, 0, 0, 0);
				}
			}, */
			isValid: function(){
				return false
			},
			size: slotsSize
		}
		elementsGUI_interface["slot_import123" + i] = {
			type: "slot",
			num: i,
			name: "slot_import" + i,
			x: elementsGUI_interface["slot_import" + i].x,
			y: elementsGUI_interface["slot_import" + i].y,
			z: -100,
			onTouchEvent: function (element, event) {
				if (event.type == 'DOWN') {
					var slot_id = this.name;
					var container = element.window.getContainer();
					var tile = container.tileEntity;
					if(!tile.getSelectedSlot){
						var elementIns = container.getElement('slot_input0'); 
						var clazz = elementIns.getClass(); 
						var field = clazz.getDeclaredField("currentSelectedSlot");
						field.setAccessible(true);
						tile.getSelectedSlot = function(name){
							return name ? field.get(elementIns).description.name : field.get(elementIns);
						}
					}
					if(tile.getSelectedSlot(true) == slot_id)container.setSlot(slot_id, 0, 0, 0);
				}
			},
			visual: true,
			size: elementsGUI_interface["slot_import" + i].size
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
			/* clicker: {
				onClick: function (param1_, param2_, param3_) {
					alert('Hi');
				},
				onLongClick: function (param1_, param2_, param3_) {
				}
			}, */
			isValid: function(){
				return false
			},
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
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				if(tileEntity.data.redstone_mode == undefined) tileEntity.data.redstone_mode = 0;
				tileEntity.data.redstone_mode = tileEntity.data.redstone_mode >= 2 ? 0 : tileEntity.data.redstone_mode + 1;
				elementsGUI_interface["image_redstone"].bitmap = 'redstone_GUI_' + tileEntity.data.redstone_mode;
				tileEntity.refreshRedstoneMode();
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
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
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				tileEntity.data.useDamage = !tileEntity.data.useDamage;
				elementsGUI_interface["image_damage"].bitmap = tileEntity.data.useDamage ? 'RS_damage_on' : 'RS_damage_off';
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
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
			onClick: function (position, container, tileEntity, window, canvas, scale) {
				tileEntity.data.useNbt = !tileEntity.data.useNbt;
				elementsGUI_interface["image_nbt"].bitmap = tileEntity.data.useNbt ? 'RS_nbt_on' : 'RS_nbt_off';
			},
			onLongClick: function (position, container, tileEntity, window, canvas, scale) {
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
})();

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

var inv_elements_interfaceGUI = interfaceGUI.getWindow('inventory').getContent();
inv_elements_interfaceGUI.elements["_CLICKFRAME_"] = {
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
			var container = element.window.getContainer();
			var tile = element.window.getContainer().tileEntity;
			if(!tile.getSelectedSlot){
				var elementIns = container.getElement('slot_input0'); 
				var clazz = elementIns.getClass(); 
				var field = clazz.getDeclaredField("currentSelectedSlot");
				field.setAccessible(true);
				tile.getSelectedSlot = function(name){
					return name ? field.get(elementIns).description.name : field.get(elementIns);
				}
			}
			var slot_id = Math.floor(event.x/251)+Math.floor(event.y/251)*4;
			var item = Player.getInventorySlot(slot_id);
			if(!item) return;
			if(item.id == 0) return;
			var selectedSlotName = tile.getSelectedSlot(true);
			if(selectedSlotName.indexOf('slot_import') == -1) return;
			var selectedSlot = container.getSlot(selectedSlotName);
			if(event.type == 'CLICK'){
				selectedSlot.count = item.id == selectedSlot.id && item.data == selectedSlot.data && selectedSlot.extra == item.extra ? Math.min(selectedSlot.count + 1, Item.getMaxStack(item.id)) : 1;
				selectedSlot.id = item.id;
				selectedSlot.data = item.data;
				selectedSlot.extra = item.extra;
			} else {
				selectedSlot.count = Item.getMaxStack(item.id);
				selectedSlot.id = item.id;
				selectedSlot.data = item.data;
				selectedSlot.extra = item.extra;
			}
		}
	}
}

RefinedStorage.createTile(BlockID.RS_interface, {
	defaultValues: {
		speed: 9,
		count: 1,
		ticks: 0,
		currentSlot: 0,
		useDamage: true,
		useNbt: true
    },
	click: function () {
		if(Entity.getSneaking(Player.get())) return false;
		if (this.container.isOpened()) return true;
		this.container.openAs(interfaceGUI);
		var content = this.container.getGuiContent();
		content.elements["image_redstone"].bitmap = 'redstone_GUI_' + (this.data.redstone_mode || 0);
		content.elements["image_damage"].bitmap = this.data.redstone_mode ? 'RS_damage_on' : 'RS_damage_off';
		content.elements["image_nbt"].bitmap = this.data.useNbt ? 'RS_nbt_on' : 'RS_nbt_off';
		return true;
	},
	tick: function(){
		this.data.ticks++
		if(this.data.ticks%this.data.speed == 0){
			if(this.container.getSlot('slot_input' + this.data.currentSlot).id == 0){
				this.data.currentSlot++;
				if(this.data.currentSlot > 8) this.data.currentSlot = 0;
			} else {
				var slot = this.container.getSlot('slot_input' + this.data.currentSlot);
				/* if(slot.count > 0)slot.count--
				this.container.clearSlot('slot_input' + this.data.currentSlot); */
				var count = Math.min(slot.count, this.data.count);
				var pushed = this.itemCanBePushed(slot, count, true);
				//var pushed = this.pushItem(slot, count);
				if(pushed == 0){
					slot.count -= count;
				} else if(pushed < count){
					slot.count -= count - pushed;
				} else {
					this.data.currentSlot++;
					if(this.data.currentSlot > 8) this.data.currentSlot = 0;
				}
				if(slot.count <= 0) this.container.clearSlot('slot_input' + this.data.currentSlot);
				this.pushItem(slot, count);
			}
		}
	},
	post_update_network: function(net_id){
		if(net_id == 'f') return;
		var ths = this;
		Network[net_id][this.coords_id()].pushItemFunc = function(item, count){
			return ths.pushItemFunc(item, count);
		}
	},
	pushItemFunc: function(item, count){
		item.count = count && count <= item.count ? count : item.count;

	},
	itemCanBePushed: function(item, count, _inverted){
		count = count || item.count;
		if (!this.isWorkAllowed()) return _inverted ? count : 0;
		var res = Network[this.data.NETWORK_ID].info.itemCanBePushed(item, count);
		return _inverted ? count - res : res;
	},
	pushItem: function (item, count) {
		count = count || item.count;
		if (!this.isWorkAllowed()) return count;
		var res = Network[this.data.NETWORK_ID].info.pushItem(item, count);
		if(this.post_pushItem)this.post_pushItem(item, count, res);
		return res;
	},
	deleteItem: function (item, count) {
		count = count || item.count;
		if (!this.isWorkAllowed()) return count;
		var res = Network[this.data.NETWORK_ID].info.deleteItem(item, count);
		if(this.post_deleteItem)this.post_deleteItem(item, count, res);
		return res;
	},
	originalItems: function(){
		if (!this.isWorkAllowed()) {
			return [];
		}
		return Network[this.data.NETWORK_ID].info.items;
	},
	originalItemsMap: function(){
		if (!this.isWorkAllowed()) {
			return [];
		}
		return Network[this.data.NETWORK_ID].info.items_map;
	},
	originalOnlyItemsMap: function(){
		if (!this.isWorkAllowed()) {
			return {};
		}
		return Network[this.data.NETWORK_ID].info.just_items_map;
	},
	originalOnlyItemsExtraMap: function(){
		if (!this.isWorkAllowed()) {
			return {};
		}
		return Network[this.data.NETWORK_ID].info.just_items_map_extra;
	},
    refreshModel: function(){
        RefinedStorage.mapTexture(this, this.data.isActive ? 'interface_on' : 'interface_off');
	},
	destroy: function(){
		for(var i = 0; i < 9; i++)this.container.clearSlot('slot_import' + i);
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
		"slot_output0": {output: true},
		"slot_output1": {output: true},
		"slot_output2": {output: true},
		"slot_output3": {output: true},
		"slot_output4": {output: true},
		"slot_output5": {output: true},
		"slot_output6": {output: true},
		"slot_output7": {output: true}
	}
});