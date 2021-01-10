Callback.addCallback("PreLoaded", function () {
	Recipes.addFurnace(406, 0, ItemID.silicon, 0);
	Recipes.addFurnace(ItemID.raw_basic_processor, 0, ItemID.basic_processor, 0);
	Recipes.addFurnace(ItemID.raw_improved_processor, 0, ItemID.improved_processor, 0);
	Recipes.addFurnace(ItemID.raw_advanced_processor, 0, ItemID.advanced_processor, 0);


	Recipes.addShapeless({id: ItemID.construction_core, count: 1, data: 0}, [{id: ItemID.basic_processor, count: 1, data: -1}, {id: 348, count: 1, data: -1}]);
	Recipes.addShapeless({id: ItemID.destruction_core, count: 1, data: 0}, [{id: ItemID.basic_processor, count: 1, data: -1}, {id: 406, count: 1, data: -1}]);
	Recipes.addShapeless({id: ItemID['storageDisk1000'], count: 1, data: 0}, [{id: ItemID.storage_housing, count: 1, data: -1}, {id: ItemID['1k_storage_part'], count: 1, data: -1}]);
	Recipes.addShapeless({id: ItemID['storageDisk4000'], count: 1, data: 0}, [{id: ItemID.storage_housing, count: 1, data: -1}, {id: ItemID['4k_storage_part'], count: 1, data: -1}]);
	Recipes.addShapeless({id: ItemID['storageDisk16000'], count: 1, data: 0}, [{id: ItemID.storage_housing, count: 1, data: -1}, {id: ItemID['16k_storage_part'], count: 1, data: -1}]);
	Recipes.addShapeless({id: ItemID['storageDisk64000'], count: 1, data: 0}, [{id: ItemID.storage_housing, count: 1, data: -1}, {id: ItemID['64k_storage_part'], count: 1, data: -1}]);


	Recipes.addShaped({id: ItemID.processor_binding, count: 8, data: 0}, [
		"   ",
		"sbs",
		"   "
	], ['s', 287, -1, 'b', 341, -1]);
	Recipes.addShaped({id: ItemID.quartz_enriched_iron, count: 4, data: 0}, [
		"ii ",
		"iq ",
		"   "
	], ['i', 265, -1, 'q', 406, -1]);
	Recipes.addShaped({id: ItemID.raw_basic_processor, count: 1, data: 0}, [
		"bi ",
		"sr ",
		"   "
	], ['i', 265, -1, 'b', ItemID.processor_binding, -1, 's', ItemID.silicon, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID.raw_improved_processor, count: 1, data: 0}, [
		"bg ",
		"sr ",
		"   "
	], ['g', 266, -1, 'b', ItemID.processor_binding, -1, 's', ItemID.silicon, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID.raw_advanced_processor, count: 1, data: 0}, [
		"bd ",
		"sr ",
		"   "
	], ['d', 264, -1, 'b', ItemID.processor_binding, -1, 's', ItemID.silicon, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID.raw_advanced_processor, count: 1, data: 0}, [
		"bd ",
		"sr ",
		"   "
	], ['d', 264, -1, 'b', ItemID.processor_binding, -1, 's', ItemID.silicon, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID.storage_housing, count: 1, data: 0}, [
		"grg",
		"r r",
		"qqq"
	], ['g', 20, -1, 'q', ItemID.quartz_enriched_iron, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID.storage_housing, count: 1, data: 0}, [
		"grg",
		"r r",
		"qqq"
	], ['g', 241, -1, 'q', ItemID.quartz_enriched_iron, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID['storageDisk1000'], count: 1, data: 0}, [
		"grg",
		"rdr",
		"qqq"
	], ['d', ItemID['1k_storage_part'], -1, 'g', 20, -1, 'q', ItemID.quartz_enriched_iron, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID['storageDisk1000'], count: 1, data: 0}, [
		"grg",
		"rdr",
		"qqq"
	], ['d', ItemID['1k_storage_part'], -1, 'g', 241, -1, 'q', ItemID.quartz_enriched_iron, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID['storageDisk4000'], count: 1, data: 0}, [
		"grg",
		"rdr",
		"qqq"
	], ['d', ItemID['4k_storage_part'], -1, 'g', 20, -1, 'q', ItemID.quartz_enriched_iron, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID['storageDisk4000'], count: 1, data: 0}, [
		"grg",
		"rdr",
		"qqq"
	], ['d', ItemID['4k_storage_part'], -1, 'g', 241, -1, 'q', ItemID.quartz_enriched_iron, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID['storageDisk16000'], count: 1, data: 0}, [
		"grg",
		"rdr",
		"qqq"
	], ['d', ItemID['16k_storage_part'], -1, 'g', 20, -1, 'q', ItemID.quartz_enriched_iron, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID['storageDisk16000'], count: 1, data: 0}, [
		"grg",
		"rdr",
		"qqq"
	], ['d', ItemID['16k_storage_part'], -1, 'g', 241, -1, 'q', ItemID.quartz_enriched_iron, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID['storageDisk64000'], count: 1, data: 0}, [
		"grg",
		"rdr",
		"qqq"
	], ['d', ItemID['64k_storage_part'], -1, 'g', 20, -1, 'q', ItemID.quartz_enriched_iron, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID['storageDisk64000'], count: 1, data: 0}, [
		"grg",
		"rdr",
		"qqq"
	], ['d', ItemID['64k_storage_part'], -1, 'g', 241, -1, 'q', ItemID.quartz_enriched_iron, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID['1k_storage_part'], count: 1, data: 0}, [
		"sqs",
		"grg",
		"sgs"
	], ['q', ItemID.quartz_enriched_iron, -1, 'g', 20, -1, 's', ItemID.silicon, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID['1k_storage_part'], count: 1, data: 0}, [
		"sqs",
		"grg",
		"sgs"
	], ['q', ItemID.quartz_enriched_iron, -1, 'g', 241, -1, 's', ItemID.silicon, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID['4k_storage_part'], count: 1, data: 0}, [
		"sqs",
		"grg",
		"sgs"
	], ['q', ItemID.quartz_enriched_iron, -1, 'g', ItemID['1k_storage_part'], -1, 's', ItemID.basic_processor, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID['16k_storage_part'], count: 1, data: 0}, [
		"sqs",
		"grg",
		"sgs"
	], ['q', ItemID.quartz_enriched_iron, -1, 'g', ItemID['4k_storage_part'], -1, 's', ItemID.improved_processor, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID['64k_storage_part'], count: 1, data: 0}, [
		"sqs",
		"grg",
		"sgs"
	], ['q', ItemID.quartz_enriched_iron, -1, 'g', ItemID['16k_storage_part'], -1, 's', ItemID.advanced_processor, -1, 'r', 331, -1]);
	Recipes.addShaped({id: ItemID['rs_upgrade'], count: 1, data: 0}, [
		"igi",
		"isi",
		"igi"
	], ['s', ItemID['improved_processor'], 0, 'g', 331, -1, 'i', ItemID['quartz_enriched_iron'], -1]);
	Recipes.addShaped({id: ItemID['RSSpeedUpgrade'], count: 1, data: 0}, [
		"igi",
		"gsg",
		"iii"
	], ['s', ItemID['rs_upgrade'], 0, 'g', 353, 0, 'i', ItemID['quartz_enriched_iron'], -1]);
	Recipes.addShaped({id: ItemID['RSStackUpgrade'], count: 1, data: 0}, [
		"sgs",
		"gsg",
		"sgs"
	], ['g', ItemID['RSSpeedUpgrade'], 0, 's', 353, 0]);


	Recipes.addShaped({id: BlockID['RS_controller'], count: 1, data: 0}, [
		"sqs",
		"grg",
		"sgs"
	], ['q', ItemID.advanced_processor, -1, 'g', ItemID.silicon, -1, 's', ItemID.quartz_enriched_iron, -1, 'r', BlockID['RSmachine_casing'], -1]);
	Recipes.addShaped({id: BlockID['RS_grid'], count: 1, data: 0}, [
		"pog",
		"qcg",
		"plg"
	], ['q', ItemID.quartz_enriched_iron, -1, 'c', BlockID['RSmachine_casing'], -1, 'g', 20, -1, 'o', ItemID.construction_core, -1, 'l', ItemID.destruction_core, -1, 'p', ItemID.improved_processor, -1]);
	Recipes.addShaped({id: BlockID['RS_grid'], count: 1, data: 0}, [
		"pog",
		"qcg",
		"plg"
	], ['q', ItemID.quartz_enriched_iron, -1, 'c', BlockID['RSmachine_casing'], -1, 'g', 241, -1, 'o', ItemID.construction_core, -1, 'l', ItemID.destruction_core, -1, 'p', ItemID.improved_processor, -1]);
	Recipes.addShaped({id: BlockID['RS_crafting_grid'], count: 1, data: 0}, [
		"ga",
		"c  ",
		"   "
	], ['a', ItemID.advanced_processor, -1, 'c', BlockID['RS_grid'], -1, 'g', 58, -1]);
	Recipes.addShaped({id: BlockID['diskDrive'], count: 1, data: 0}, [
		"ihi",
		"ici",
		"iai"
	], ['a', ItemID.advanced_processor, -1, 'c', BlockID['RSmachine_casing'], -1, 'i', 265, -1, 'h', 54, -1]);
	Recipes.addShaped({id: BlockID['diskDrive'], count: 1, data: 0}, [
		"ihi",
		"ici",
		"iai"
	], ['a', ItemID.advanced_processor, -1, 'c', BlockID['RSmachine_casing'], -1, 'i', 265, -1, 'h', 130, -1]);
	Recipes.addShaped({id: BlockID['RS_cable'], count: 12, data: 0}, [
		"iii",
		"grg",
		"iii"
	], ['g', 20, -1, 'r', 331, -1, 'i', ItemID.quartz_enriched_iron, -1]);
	Recipes.addShaped({id: BlockID['RS_cable'], count: 12, data: 0}, [
		"iii",
		"grg",
		"iii"
	], ['g', 241, -1, 'r', 331, -1, 'i', ItemID.quartz_enriched_iron, -1]);
	Recipes.addShaped({id: BlockID['RSmachine_casing'], count: 1, data: 0}, [
		"iii",
		"isi",
		"iii"
	], ['s', 1, 0, 'i', ItemID.quartz_enriched_iron, -1]);
	Recipes.addShaped({id: BlockID['RS_interface'], count: 1, data: 0}, [
		"ihi",
		"rsr",
		"ihi"
	], ['s', BlockID['RSmachine_casing'], 0, 'i', ItemID.quartz_enriched_iron, -1, 'h', 410, -1, 'r', 331, -1]);//TODO: remake craft
});