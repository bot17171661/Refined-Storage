ModAPI.registerAPI("RefinedStorageAPI", {
    requireGlobal: function (command) {
        return eval(command);
    },
    RefinedStorage: RefinedStorage,
    Disk: Disk
});
Logger.Log("RefinedStorageAPI Loaded", "API");