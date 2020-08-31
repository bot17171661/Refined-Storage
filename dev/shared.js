ModAPI.registerAPI("RefinedStorageAPI", {
  requireGlobal: function (command) {
    return eval(command);
  }
});
Logger.Log("RefinedStorageAPI Loaded", "API");