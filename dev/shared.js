ModAPI.registerAPI("RefinedStorageAPI", {
    requireGlobal: function (command) {
        return eval(command);
    },
    RefinedStorage: RefinedStorage,
    Disk: Disk,
    controllerAPI: controllerFuncs,
    gridAPI: gridFuncs,
    craftingGridAPI: craftingGridFuncs
});
Logger.Log("RefinedStorageAPI Loaded", "API");