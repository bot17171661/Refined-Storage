IDRegistry.genBlockID("RS_cable");
Block.createBlock("RS_cable", [
	{
		name: "Cable",
		texture: [
            ['cable', 0]
        ],
		inCreative: true
	}
], {
	renderlayer: 1
})
mod_tip(BlockID['RS_cable']);
RS_blocks.push(BlockID['RS_cable']);
EnergyUse[BlockID['RS_cable']] = Config.energy_uses.cable;

/* Block.registerPlaceFunction('RS_cable', function(coords, item, block){
	var coords = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
	var relBlock = World.getBlock(coords.x, coords.y, coords.z);
	if (relBlock.id != 0 && relBlock.id != 9 && relBlock.id != 11) return;
    World.setBlock(coords.x, coords.y, coords.z, BlockID.RS_cable, 0);
	Player.decreaseCarriedItem(1);
	if(_controllerCoords_ = searchController(coords)){
		var tile  = World.getTileEntity(_controllerCoords_.x, _controllerCoords_.y, _controllerCoords_.z);
		if(tile){
			tile.updateControllerNetwork();
		}
	}
}); */

(function () {
	var width = 1/4;

	RSgroup.add(BlockID.RS_cable, -1);

	var boxes = [
		{side: [1, 0, 0], box: [0.5 + width / 2, 0.5 - width / 2, 0.5 - width / 2, 1, 0.5 + width / 2, 0.5 + width / 2]},
		{side: [-1, 0, 0], box: [0, 0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2]},
		{side: [0, 1, 0], box: [0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2, 1, 0.5 + width / 2]},
		{side: [0, -1, 0], box: [0.5 - width / 2, 0, 0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2]},
		{side: [0, 0, 1], box: [0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, 1]},
		{side: [0, 0, -1], box: [0.5 - width / 2, 0.5 - width / 2, 0, 0.5 + width / 2, 0.5 + width / 2, 0.5 - width / 2]}
	];

	var Dmodel = new ICRender.CollisionShape();
	var render = new ICRender.Model();
	for (var i in boxes) {
		var wire = boxes[i].box;
		var side = boxes[i].side;
		render.addEntry(new BlockRenderer.Model(wire[0], wire[1], wire[2], wire[3], wire[4], wire[5], BlockID.RS_cable, 0)).setCondition(new ICRender.BLOCK(side[0], side[1], side[2], RSgroup, false));
		var entry = Dmodel.addEntry();
		entry.addBox(wire[0], wire[1], wire[2], wire[3], wire[4], wire[5]);
		entry.setCondition(new ICRender.BLOCK(side[0], side[1], side[2], RSgroup, false));
	}
	render.addEntry(new BlockRenderer.Model(0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, BlockID.RS_cable, 0));
	var entry = Dmodel.addEntry();
	entry.addBox(0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2);
	BlockRenderer.setCustomCollisionShape(BlockID.RS_cable, -1, Dmodel);
	BlockRenderer.setCustomRaycastShape(BlockID.RS_cable, -1, Dmodel);
	BlockRenderer.setStaticICRender(BlockID.RS_cable, -1, render);
})();

(function(){
	var width = 1/4;

	var boxes = [
		[0.5 + width / 2, 0.5 - width / 2, 0.5 - width / 2, 1, 0.5 + width / 2, 0.5 + width / 2],
		[0, 0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2],
		[0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2]
	]
	var render = new ICRender.Model();
	for(var i in boxes){
		render.addEntry(new BlockRenderer.Model(boxes[i][0], boxes[i][1], boxes[i][2], boxes[i][3], boxes[i][4], boxes[i][5], BlockID.RS_cable, 0));
	}
	ItemModel.getFor(BlockID.RS_cable, 0).setModel(render);
})();