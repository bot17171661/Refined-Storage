EnergyUse['disk'] = Config.energy_uses.diskDrivePerDisk;
Disk.register('1k Storage Disk', '1Kdisk', 1000);
/* if(Config.dev)Item.registerUseFunction("storageDisk1000", function (coords, item, block) {
    if(item.data == 0) item.data = DiskData.length;
    disk_data = Disk.getDiskData(item);
    for(var i = 1; i <= 5000; i++){
        var item1 = {id: i, data: 0, count: i*100000, extra: null};
        disk_data.items[i + '_0'] = item1;
    }
    disk_data.items_stored = 1000;
}) */
Disk.register('4k Storage Disk', '4Kdisk', 4000);
Disk.register('16k Storage Disk', '16Kdisk', 16000);
Disk.register('64k Storage Disk', '64Kdisk', 64000);
Disk.register('Creative Storage Disk', 'creativeDisk', Infinity);