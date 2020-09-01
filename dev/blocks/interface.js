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



RefinedStorage.createTile(BlockID.RS_interface, {
	defaultValues: {
        
    },
    refreshModel: function(){
        RefinedStorage.mapTexture(this, this.data.isActive ? 'interface_on' : 'interface_off');
    }
})