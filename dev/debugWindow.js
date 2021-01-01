if(Config.dev)(function(){
    var MainGUIElements = {};
    //alert('Pid: ' + android.os.Process.myPid());
    var context = UI.getContext();
    var activityManager = context.getSystemService(context.ACTIVITY_SERVICE);
    var memoryInfo = activityManager.getProcessMemoryInfo([android.os.Process.myPid()]);
    var _X_ = 5;
    (function(){
        MainGUIElements['fps'] = {
            type: "fps", 
            x: _X_,
            z: 100
        };
        MainGUIElements['ram'] = {
            type: "text",
            x: _X_,
            y: 40,
            text: 'RAM Used: 0',
            z: 10,
            font: {
                color: android.graphics.Color.WHITE,
                size: 30,
                shadow: 0.5
            }
        };
        MainGUIElements['tps'] = {
            type: "text",
            x: _X_,
            y: 80,
            text: 'Server TPS: 0',
            z: 10,
            font: {
                color: android.graphics.Color.WHITE,
                size: 30,
                shadow: 0.5
            }
        };
        MainGUIElements['localtps'] = {
            type: "text",
            x: _X_,
            y: 120,
            text: 'Client TPS: 0',
            z: 10,
            font: {
                color: android.graphics.Color.WHITE,
                size: 30,
                shadow: 0.5
            }
        };
        MainGUIElements['ping'] = {
            type: "text",
            x: _X_,
            y: 160,
            text: 'Ping: Infinity',
            z: 10,
            font: {
                color: android.graphics.Color.WHITE,
                size: 30,
                shadow: 0.5
            }
        };
        jSetInterval(function(){
            memoryInfo = activityManager.getProcessMemoryInfo([android.os.Process.myPid()]);
            MainGUIElements['ram'].text = 'RAM Used: ' + (memoryInfo[0].getTotalPss()/1024).toFixed(2) + ' mb';
            //alert(memoryInfo[0].getTotalPss());
        }, 300);
        var lasttime = -1;
        var frame = 0;
        var lasttps = 0
        setInterval(function(){
            var t = Debug.sysTime();
            if (frame++ % 20 == 0) {
                if (lasttime != -1) {
                    tps = Math.round(1000 / (t - lasttime) * 20);
                    //Game.tipMessage(Math.round(tps * 10) / 10 + "tps");
                    if(lasttps != (lasttps = tps))Network.sendToAllClients("RefinedStoragePE.debugTPSmeter", {
                        tps: tps
                    });
                }
                lasttime = t
            }
        }, 1);
        var responseGetted = true;
        Network.addClientPacket("RefinedStoragePE.debugTPSmeter", function(packetData) {
            MainGUIElements['tps'].text = 'Server TPS: ' + (Math.round(packetData.tps * 10) / 10)
        });
        Network.addClientPacket("RefinedStoragePE.pingResponse", function(packetData) {
            MainGUIElements['ping'].text = 'Ping: ' + (Debug.sysTime() - packetData.startTime) + ' ms';
            responseGetted = true;
        });
        Network.addServerPacket("RefinedStoragePE.ping", function(client, packetData) {
            client.send('RefinedStoragePE.pingResponse', {startTime: packetData.startTime});
        });
        jSetInterval(function(){
            if(responseGetted && _LevelDisplayed){
                Network.sendToServer("RefinedStoragePE.ping", {startTime: Debug.sysTime()});
                responseGetted = false;
            } else {
                MainGUIElements['ping'].text = 'Ping: Infinity';
            }
        }, 1500);
        var lasttime1 = -1;
        var frame1 = 0;
        setIntervalLocal(function(){
            var t = Debug.sysTime();
            if (frame1++ % 20 == 0) {
                if (lasttime1 != -1) {
                    tps = Math.round(1000 / (t - lasttime1) * 20);
                    //Game.tipMessage(Math.round(tps * 10) / 10 + "tps")
                    MainGUIElements['localtps'].text = 'Client TPS: ' + Math.round(tps * 10) / 10
                }
                lasttime1 = t
            }
        }, 1)
    })();
    var MainGUI = new UI.Window({
        location: { 
            x: 100, 
            y: 0, 
            width: 300, 
            height: 60
        }, 
        drawing: [{type: 'color', color: android.graphics.Color.argb(76, 76, 76, 100)}/* , {type: "line", x1: 500, y1: 0, x2: 500, y2: 200, width: 2.5, color: android.graphics.Color.WHITE} */],
        elements: MainGUIElements
    });
    //var maxHeight = 1000*MainGUI.getLocation().getWindowHeight/MainGUI.getLocation().getWindowWidth;
    Callback.addCallback("LevelLeft", function () {
        MainGUIElements['tps'].text = 'Server TPS: 0';
        MainGUIElements['localtps'].text = 'Client TPS: 0';
        MainGUIElements['ping'].text = 'Ping: Infinity';
    });
    MainGUI.setAsGameOverlay(true);
    MainGUI.setTouchable(false);
    var fps_element = MainGUI.getContentProvider().elementMap.get("fps");
    var clazz = fps_element.getClass().getSuperclass();
    var field = clazz.getDeclaredField("font");
    field.setAccessible(true);
    var fontParam = field.get(fps_element);
    fontParam.size = parseFloat(30);
    MainGUI.open();
})();