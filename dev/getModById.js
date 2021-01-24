/* var ModLoadingOverlay = WRAP_JAVA('com.zhekasmirnov.innercore.ui.ModLoadingOverlay');
//var fps_element = MainGUI.getContentProvider().elementMap.get("fps");
ModLoadingOverlay = new ModLoadingOverlay(UI.getContext());
alert(ModLoadingOverlay);
var clazz = ModLoadingOverlay.getClass();
var field = clazz.getDeclaredField("overlayInstances");
field.setAccessible(true);
var overlayInstances = field.get(ModLoadingOverlay);
var it = overlayInstances.iterator();
var getCurrentText = function(){};
while(it.hasNext()){
    var newOverlay = it.next();
    var _clazz = newOverlay.getClass();
    var _field = _clazz.getDeclaredField("drawable");
    _field.setAccessible(true);
    var drawable = _field.get(newOverlay);
    alert(drawable);
    if (drawable != null) {
        var __clazz = drawable.getClass();
        var __field = __clazz.getDeclaredField("text");
        __field.setAccessible(true);
        getCurrentText = function(){
            return __field.get(drawable);
        }
        alert(getCurrentText());
        break;
    }
}
alert(overlayInstances);
var ModLoader = WRAP_JAVA('com.zhekasmirnov.innercore.mod.build.ModLoader');
ModLoader = ModLoader.instance;
alert(ModLoader.modsList);
function getCurrentMod(){
    var _text = getCurrentText();
    if(_text.indexOf('Running Mods') != -1){
        var _index = Number(_text.substr(14, _text.indexOf('/') - 14)) - 1;
        var _mod = ModLoader.modsList.get(_index);
        return _mod.getName();
    }
}
alert(getCurrentMod()); */