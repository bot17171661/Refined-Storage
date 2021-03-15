(function(){
    var MODID = 638;

    var JAVA_URL = java.net.URL;
    var BufferedReader = java.io.BufferedReader;
    var InputStreamReader = java.io.InputStreamReader;
    var Uri = android.net.Uri;
    var Intent = android.content.Intent;
    
    var changelogEnabled = false;

    function getUrlContent(_url, _parse){
        var isError = {data: undefined};
        try {
            var input;
            var inputOpened = true;
            result = '';
            /* jSetTimeout(function(){//522;
                if(result.length == 0 && !isError.data){
                    alert('[RefinedStoragePE] Your internet connection is very slow\nIf you do not want to see this message and want make loading faster then change "changelogEnabled" to "false" in RefinedStoragePE config file');
                }
            }, 5000); */
            var _URL_ = new JAVA_URL(_url);
            input = new BufferedReader(new InputStreamReader(_URL_.openStream()));
            while (inputOpened) {
                inputLine = input.readLine();
                if (inputLine) {
                    result += inputLine + '\n';
                } else {
                    input.close();
                    var data = result.substr(0, result.length - 1);
                    if(_parse) data = JSON.parse(data);
                    return {data: data};
                }
            }
            return {error:'408 Request Timeout'};
        } catch (e) {
            isError.data = e;
            Logger.Log('getUrlContent Error: ' + JSON.stringify(e), 'RefinedStoragePE');
            return {error: e};
        }
    }
    
    var padding = 40;
    var thisWindows = {};
    var mainWindows = ['main'];//['close_tab', 'main', 'tabs'];
    var infoWindows = ['info', 'donations'];
    var changelogWindows = ['changelog'];
    var allWindows = mainWindows.concat(infoWindows).concat(changelogWindows);
    var controllerIconAnim = [];
    for(var i = 0; i < 12; i++){
        controllerIconAnim.push('controllerImage_' + i);
    }
    var controllerIconAnimWithoutShadow = [];
    for(var i = 0; i < 12; i++){
        controllerIconAnimWithoutShadow.push('controllerImageWithoutShadow_' + i);
    }
    controllerIconAnim.delay = controllerIconAnimWithoutShadow.delay = 2;

    var tabImageSettings = {
        padding : 15,
        size: 35
    }
    var closeButton = {
        percents: 0.6,
        size: 60
    }
    closeButton.buttonSize = closeButton.size*closeButton.percents;
    closeButton.buttonPadding = (closeButton.size-closeButton.buttonSize)/2;
    var tabsSettings = {
        width: 300,
        height: 56
    }
    var mainLocation = { x: padding, y: padding, width: 1000 - padding*2, height: UI.getScreenHeight() - padding*2 };
    ModInfoUI_changelog_height = mainLocation.height*1000/mainLocation.width;
    var mainElements = {
        "upTabCloseButton": {
            type: "image",
            x: 1000-closeButton.size,
            y: 0,
            z: -10,
            width: closeButton.size,
            height: closeButton.size,
            bitmap: "tab_up_close_button",
            scale: 2,
        },
        "closeButton": {
            type: "button", 
            x: 1000 - closeButton.buttonSize - closeButton.buttonPadding, 
            y: closeButton.buttonPadding, 
            z: 10, 
            scale: closeButton.buttonSize/15, 
            bitmap: "classic_close_button", 
            bitmap2: "classic_close_button_down",
            clicker: {
                onClick: function(){
                    for(var i in allWindows)if(thisWindows[allWindows[i]].isOpened())thisWindows[allWindows[i]].close();
                }
            }
        },
        "upTabInfo": {
            type: "frame",
            x: 0,
            y: 0,
            z: 1,
            width: tabsSettings.width,
            height: tabsSettings.height,
            isTab: true,
            isSelected: true,
            bitmap: "classic_tab_up_light_left",
            scale: 2,
            onTouchEvent: function(element, event){
                if(event.type == 'CLICK' && !this.isSelected){
                    switchPage('info');
                }
            }
        },
        "upTabInfo_text": {
            type: "text",
            x: tabImageSettings.size + tabImageSettings.padding*2,
            y: tabsSettings.height/2 - 11,
            z: 10,
            text: Translation.translate('Information'),
            font: {
                color: android.graphics.Color.DKGRAY,
                shadow: 0
            }
        },
        "upTabInfo_image": {
            type: "image",
            x: tabImageSettings.padding,
            y: (tabsSettings.height - tabImageSettings.size)/2,
            z: 10,
            bitmap: controllerIconAnim,
            scale: tabImageSettings.size/17 
        },
        "upTabChangelog": {
            type: "frame",
            x: tabsSettings.width,
            y: 0,
            z: -1,
            width: tabsSettings.width,
            height: tabsSettings.height,
            isTab: true,
            isSelected: false,
            bitmap: "classic_tab_up_dark",
            scale: 2,
            onTouchEvent: function(element, event){
                if(event.type == 'CLICK' && !this.isSelected){
                    switchPage('changelog');
                }
            }
        },
        "upTabChangelog_text": {
            type: "text",
            x: tabsSettings.width + tabImageSettings.size + tabImageSettings.padding*2,
            y: tabsSettings.height/2 - 11,
            z: 10,
            text: Translation.translate('Changelog'),
            font: {
                color: android.graphics.Color.DKGRAY,
                shadow: 0
            }
        },
        "upTabChangelog_image": {
            type: "image",
            z: 10,
            x: tabsSettings.width + tabImageSettings.padding,
            y: (tabsSettings.height - tabImageSettings.size)/2,
            bitmap: 'changelogImage',
            scale: tabImageSettings.size/16 
        },
        "frame": {
            type: "frame",
            x: 0,
            y: 50,
            width: 1000,
            height: ModInfoUI_changelog_height - 50,
            bitmap: "changelog_frame",
            scale: 2,
        }
    }
    thisWindows["main"] = new UI.Window({
        location: mainLocation, 
        drawing: [{
            type: "color",
            color: android.graphics.Color.TRANSPARENT
        }],
        elements: mainElements
    });

    var skipButton = false;
    var ModInfoUI_Button = new UI.Window({
        location: { x: DISPLAY.getWidth()*0.12107/*0.335*/*(1000/DISPLAY.getWidth()) - 70/2/* - UI.getScreenHeight()*0.0087962*/, y: UI.getScreenHeight()*0.4375, z: -1, width: 70, height: 70 }, 
        elements: {
            "button": {
                type: "button", x: 0, y: 0, scale: 1000/111, bitmap: "NativeButton", bitmap2: "NativeButtonPressed",
                clicker: {
                    onClick: function(){
                        switchPage('info');
                    }
                }
            },
            "image": {
                type: "image", x: 200, y: 200, z: 10, scale: 600/17, bitmap: controllerIconAnim
            }
        }
    });
    ModInfoUI_Button.setAsGameOverlay(true);
    var ModInfoUI_Button_Container = new UI.Container();

    var uisPadding = 40;
    var uisSidePadding = 20;
    var infoWindowLocation = { x: padding + uisPadding + uisSidePadding, y: padding + uisPadding + mainLocation.height/UI.getScreenHeight()*mainElements.frame.y, width: 1000 - padding*2 - uisPadding*2 - uisSidePadding*2, height: UI.getScreenHeight() - padding*2 - uisPadding*2 - (ModInfoUI_changelog_height/mainLocation.width*tabsSettings.height) };
    var infoWindowHeight = infoWindowLocation.height*1000/infoWindowLocation.width;
    var infoWindowSettins = {
        top: {
            height: infoWindowHeight*1.5/3,
            textPadding: 40
        }
    }
    var infoElements = {
        'image': {
            type: "image", 
            x: 0, 
            y: 0, 
            z: 10, 
            //scale: 14, 
            width: 224,
            height: 224,
            bitmap: FileTools.ReadImage(__dir__ + 'mod_icon.png')//controllerIconAnimWithoutShadow
        },
        'modName': {
            type: "text",
            x: 272,
            y: 23,
            text: mod.name,
            z: 10,
            font: {
                color: android.graphics.Color.WHITE,
                size: 40/562.5*UI.getScreenHeight(),//40,
                shadow: 0
            }
        },
        'modAuthor': {
            type: "text",
            x: 272,
            y: 0,
            text: Translation.translate('Author') + ' : ' + mod.author,
            z: 10,
            font: {
                color: android.graphics.Color.LTGRAY,
                size: 28/562.5*UI.getScreenHeight(),
                shadow: 0
            }
        },
        'modVersion': {
            type: "text",
            x: 272,
            y: 0,
            text: Translation.translate('Version') + ' : ' + mod.version,
            z: 10,
            font: {
                color: android.graphics.Color.LTGRAY,
                size: 20/562.5*UI.getScreenHeight(),
                shadow: 0
            }
        },
        'modLinks': {
            type: "text",
            x: 272,
            y: 0,
            text: Translation.translate('Links') + ' : ',
            z: 10,
            font: {
                color: android.graphics.Color.LTGRAY,
                size: 20/562.5*UI.getScreenHeight(),
                shadow: 0
            }
        },
        'modLink1': {
            type: "text",
            x: 0,
            y: 0,
            text: 'Original',
            z: 10,
            clicker: {
                onClick: function(){
                    var openURL = Intent(android.content.Intent.ACTION_VIEW);
                    openURL.data = Uri.parse("https://refinedmods.com/refined-storage/");
                    UI.getContext().startActivity(openURL);
                }
            },
            font: {
                color: android.graphics.Color.argb(255, 70, 70, 255),
                bold: true,
                underline: true,
                size: 20/562.5*UI.getScreenHeight(),
                shadow: 0
            }
        },
        'modLink2': {
            type: "text",
            x: 0,
            y: 0,
            text: 'DonationAlerts',
            z: 10,
            clicker: {
                onClick: function(){
                    var openURL = Intent(android.content.Intent.ACTION_VIEW);
                    openURL.data = Uri.parse("https://www.donationalerts.com/r/bot1023123123123");
                    UI.getContext().startActivity(openURL);
                }
            },
            font: {
                color: android.graphics.Color.argb(255, 70, 70, 255),
                bold: true,
                underline: true,
                size: 20/562.5*UI.getScreenHeight(),
                shadow: 0
            }
        },
        'modLink3': {
            type: "text",
            x: 0,
            y: 0,
            text: 'GitHub',
            z: 10,
            clicker: {
                onClick: function(){
                    var openURL = Intent(android.content.Intent.ACTION_VIEW);
                    openURL.data = Uri.parse("https://github.com/bot17171661/Refined-Storage");
                    UI.getContext().startActivity(openURL);
                }
            },
            font: {
                color: android.graphics.Color.argb(255, 70, 70, 255),
                bold: true,
                underline: true,
                size: 20/562.5*UI.getScreenHeight(),
                shadow: 0
            }
        },
        'credits': {
            type: "text",
            x: 272,
            y: 0,
            text: Translation.translate('Credits') + ' : Zero, DeimoN, Asasen, BANER, Hunabis, Dray',
            z: 10,
            font: {
                color: android.graphics.Color.LTGRAY,
                size: 16/562.5*UI.getScreenHeight(),
                shadow: 0
            }
        }
    }
    var infoWindowModInfoPadding = 10;
    infoElements['modAuthor'].y = infoElements['modName'].y + infoElements['modName'].font.size*1.1 + infoWindowModInfoPadding;
    infoElements['modVersion'].y = infoElements['modAuthor'].y + infoElements['modAuthor'].font.size*1.1 + infoWindowModInfoPadding;
    infoElements['modLinks'].y = infoElements['modVersion'].y + infoElements['modVersion'].font.size*1.1 + infoWindowModInfoPadding;
    infoElements['credits'].y = infoElements['modLinks'].y + infoElements['modLinks'].font.size*1.1 + infoWindowModInfoPadding;
    thisWindows["info"] = new UI.Window({
        location: infoWindowLocation, 
        drawing: [{
            type: "color",
            color: android.graphics.Color.TRANSPARENT
        }],
        elements: infoElements
    });
    thisWindows["info"].forceRefresh();

    var firstOpen = true;
    var textsArray = ['modLinks', 'modLink1', 'modLink2', 'modLink3'];
    var textsPadding = 15;
    thisWindows["info"].setEventListener({
        onOpen: function(window12){
            if(!firstOpen) return;
            firstOpen = false;
            for(var i = 0; i <= textsArray.length; i++){
                /* var elementIns = window12.getElements().get(textsArray[i]);
                var clazz = elementIns.getClass();
                var field = clazz.getDeclaredField("textBounds");
                field.setAccessible(true);
                var value = field.get(elementIns).width(); */
                var drawScale = window12.location.getDrawingScale();
                var _font = new JavaFONT(infoElements[textsArray[i]].font);
                var value = _font.getBounds(infoElements[textsArray[i]].text, infoElements[textsArray[i]].x * drawScale, infoElements[textsArray[i]].y * drawScale, parseFloat(1.0)).width();
                infoElements[textsArray[i]].textWidth = value;
                if(i == 0) continue;
                infoElements[textsArray[i]].x = infoElements[textsArray[i - 1]].x + infoElements[textsArray[i - 1]].textWidth + textsPadding;
                infoElements[textsArray[i]].y = infoElements[textsArray[i - 1]].y;
            }
        }
    })

    var changelogTexts = [];
    var changelogElements = {
        last: -1
    }
    var changelogWindowLocation = Object.assign({}, infoWindowLocation);
    //changelogWindowLocation.scrollY = 100;
    thisWindows["changelog"] = new UI.Window({
        location: changelogWindowLocation, 
        drawing: [{
            type: "color",
            color: android.graphics.Color.TRANSPARENT
        }],
        elements: changelogElements
    });
    thisWindows["changelog"].forceRefresh();

    var donationsWindowLocation = Object.assign({}, infoWindowLocation);
    donationsWindowLocation.x += donationsWindowLocation.width*0.7;
    donationsWindowLocation.width *= 0.3;
    donationsWindowLocation.height = thisWindows["info"].location.windowToGlobal(224);
    var donationsWindowHeight = donationsWindowLocation.height*1000/donationsWindowLocation.width;
    var _yoffset = (donationsWindowHeight - 70)/5.5;
    var donationsElements = {
        'header': {
            type: "text",
            x: 100,
            y: 10,
            text: Translation.translate('Top donaters'),
            needWidth: 900,
            z: 10,
            font: {
                color: android.graphics.Color.argb(255, 251, 140, 43),//android.graphics.Color.argb(255, 225, 225, 0),
                bold: true,
                size: 1,
                shadow: 0
            }
        }
    }
    thisWindows["donations"] = new UI.Window({
        location: donationsWindowLocation, 
        drawing: [{
            type: "color",
            color: /* android.graphics.Color.argb(76, 76, 76, 100) */android.graphics.Color.TRANSPARENT
        }],
        elements: donationsElements
    });
    thisWindows["donations"].forceRefresh();
    var firstOpen2 = true;
    var textsArray2 = ['header'];
    thisWindows["donations"].setEventListener({
        onOpen: function(window12){
            if(!firstOpen2) return;
            firstOpen2 = false;
            for(var i = 0; i < textsArray2.length; i++){
                var _name = textsArray2[i];
                var drawScale = window12.location.getDrawingScale();
                var _font = new JavaFONT(donationsElements[_name].font);
                var value = _font.getBounds(donationsElements[_name].text, donationsElements[_name].x * drawScale, donationsElements[_name].y * drawScale, parseFloat(1.0)).width();
                donationsElements[_name].font.size = Math.min(parseFloat(donationsElements[_name].needWidth/value), 70);
                //alert(donationsElements[_name].font.size);
                var _font = new JavaFONT(donationsElements[_name].font);
                var value = _font.getBounds(donationsElements[_name].text, donationsElements[_name].x * drawScale, donationsElements[_name].y * drawScale, parseFloat(1.0)).width();
                donationsElements[_name].x = 500 - value/2;
            }
            window12.forceRefresh();
        }
    });
    
    var donaters = getUrlContent('https://raw.githubusercontent.com/bot17171661/RefinedStorageDon/main/info.json', true).data;
    if(donaters)for(var k in donaters){
        donationsElements['d' + k] = {
            type: "text",
            x: 100,
            y: 10 + _yoffset*(Number(k) + 1),
            text: donaters[k].username + "  -  " + donaters[k].amount + " " + donaters[k].currency,
            needWidth: 900,
            z: 10,
            font: {
                color: android.graphics.Color.argb(255, 251, 140, 43),//android.graphics.Color.argb(255, 225, 225, 0),
                //bold: true,
                size: 1,
                shadow: 0
            }
        }
        textsArray2.push('d' + k);
    }
    thisWindows["donations"].forceRefresh();

    Callback.addCallback('NativeGuiChanged', function(name, lastName, isPushEvent){
        if(name == 'start_screen' && !thisWindows['main'].isOpened())
            ModInfoUI_Button_Container.openAs(ModInfoUI_Button);
        else if(ModInfoUI_Button_Container.isOpened())
            ModInfoUI_Button_Container.close();
    })
    Callback.addCallback('PostLoaded', function(){
        if(skipButton) return;
        ModInfoUI_Button_Container.openAs(ModInfoUI_Button);
    }, -10000);

    function switchPage(name){
        for(var i in mainWindows){
            if(!thisWindows[mainWindows[i]].isOpened())thisWindows[mainWindows[i]].open();
        }
        switch(name){
            case 'info' || 'upTabInfo':
                for(var i in mainElements){
                    if(i == 'upTabInfo' || !mainElements[i].isTab) continue;
                    mainElements[i].isSelected = false;
                    mainElements[i].z = -1;
                    mainElements[i].bitmap = 'classic_tab_up_dark';
                }
                mainElements['upTabInfo'].isSelected = true;
                mainElements['upTabInfo'].z = 1;
                mainElements['upTabInfo'].bitmap = 'classic_tab_up_light';
                mainElements['upTabInfo'].bitmap = 'classic_tab_up_light_left';

                for(var i in changelogWindows)if(thisWindows[changelogWindows[i]].isOpened())thisWindows[changelogWindows[i]].close();
                for(var i in infoWindows)if(!thisWindows[infoWindows[i]].isOpened())thisWindows[infoWindows[i]].open();
            break;
            case 'changelog' || 'upTabChangelog':
                for(var i in mainElements){
                    if(i == 'upTabChangelog' || !mainElements[i].isTab) continue;
                    mainElements[i].isSelected = false;
                    mainElements[i].z = -1;
                    if(i == 'upTabInfo'){
                        mainElements[i].bitmap = 'classic_tab_up_dark_left';
                        continue
                    }
                    mainElements[i].bitmap = 'classic_tab_up_dark';
                }
                mainElements['upTabChangelog'].isSelected = true;
                mainElements['upTabChangelog'].z = 1;
                mainElements['upTabChangelog'].bitmap = 'classic_tab_up_light';

                for(var i in infoWindows)if(thisWindows[infoWindows[i]].isOpened())thisWindows[infoWindows[i]].close();
                for(var i in changelogWindows)if(!thisWindows[changelogWindows[i]].isOpened())thisWindows[changelogWindows[i]].open();
            break;
        }
    }

    if(!Config.changelogEnabled) return;
    _setTip('[RefinedStoragePE] Getting versions info');

    var versionsMap = getUrlContent('https://raw.githubusercontent.com/bot17171661/RefinedStorageChangelog/master/map.txt');
    if(versionsMap.data)versionsMap = JSON.parse(versionsMap.data);
    else return;

    function getNewestVersion(){
        /* var data = getUrlContent('https://icmods.mineprogramming.org/mod?id=' + MODID);
        if(data.error)alert("Error: " + JSON.stringify(data.error));
        if(data.error) return 0;
        var _code = '<span class="version">';
        var index1 = data.data.indexOf(_code) + _code.length + 1;
        var string = data.data.substr(index1, data.data.indexOf(']', index1) - index1);
        return string.replace(/[^A-Za-z0-9_\s\.]/g, ''); */
        return versionsMap[0];
    }
    
    function parseVersion(_version){
        if(versionsMap.indexOf(_version) == -1) return false;
        var _version_data = getUrlContent('https://raw.githubusercontent.com/bot17171661/RefinedStorageChangelog/master/' + _version + '.txt');
        if(_version_data.error) return false;
        _version_data = _version_data.data;
        var texts = {};
        var splited = _version_data.split('\n\n');
        for(var i in splited){
            var _index = splited[i].indexOf(':');
            texts[splited[i].substr(0, _index).replace(/(\n|\t|﻿)+/g, '')] = splited[i].substr(_index + 1);
        }
        changelogTexts.push(texts.en);
        Translation.addTranslation(texts.en, texts);
        return true;
    }
    function nextChangelog(){
        if(!goToChangelog(changelogElements.last + 1)) return false;
    }

    function goToChangelog(_id){
        if(changelogTexts[_id]) return false;
        if(!parseVersion(versionsMap[_id])) return false;
        var _y = changelogEnabled ? 100 : 0;
        if(_id > 0){
            _y = changelogElements["frame" + (_id - 1)].y + changelogElements["frame" + (_id - 1)].height + 5;
        }
        if(_id == 0 && changelogEnabled){
            changelogElements["newVersionNotification"] = {
                type: "text",
                id: _id,
                x: 30,
                y: 30,
                text: Translation.translate('Hey, new version is available, please, update'),
                z: 10,
                multiline: true,
                font: {
                    color: android.graphics.Color.WHITE,
                    size: 35/562.5*UI.getScreenHeight(),
                    shadow: 0
                }
            }
        }
        changelogElements["frame" + _id] = {
            type: "frame",
            id: _id,
            x: 0,
            y: _y,
            z: -1,
            width: 1000,
            height: 125,
            bitmap: "grayFrame",
            scale: 3,
            onTouchEvent: function(element, event){
                if(event.type == 'MOVE' && !this.moving){
                    this.moving = true;
                    var __id = changelogElements.last + 1;
                    if(changelogTexts[__id]) return false;
                    if(!versionsMap[_id]) return false;
                    var craftsThread = java.lang.Thread({
                        run: function(){
                            try {
                                for(var i = 0; i < 3; i++)nextChangelog();
                            } catch(err){
                                alert('Sorry, i broke :_(' + JSON.stringify(err));
                            }
                        }
                    });
                    craftsThread.setPriority(java.lang.Thread.MIN_PRIORITY);
                    craftsThread.start();

                }
            }
        }
        thisWindows["changelog"].location.setScroll(0, thisWindows["changelog"].location.windowToGlobal(_y + 125));
        if(thisWindows["changelog"].isOpened())thisWindows["changelog"].updateWindowLocation();
        changelogElements["versionText" + _id] = {
            type: "text",
            id: _id,
            x: changelogElements["frame" + _id].x + 15,
            y: changelogElements["frame" + _id].y + 15,
            text: versionsMap[_id] + ':',
            z: 10,
            multiline: true,
            font: {
                color: android.graphics.Color.WHITE,
                size: 30,
                shadow: 0
            }
        }
        var descrText = Translation.translate(changelogTexts[_id]);
        var symbolsLength = 50;
		descrText = descrText.split('\n').map(function(value){
            var last_sim = 0; 
            if(value.length > symbolsLength)for (var i = 0; i < Math.trunc(value.length / symbolsLength); i++) {
                var indexOf = value.substr(last_sim, symbolsLength).lastIndexOf(" ");
                value = setCharAt(value, indexOf + last_sim, "\n");
                last_sim += indexOf;
            }
            return value;
        }).join('\n');
        changelogElements["descriptionText" + _id] = {
            type: "text",
            id: _id,
            x: changelogElements["frame" + _id].x + 50,
            y: changelogElements["frame" + _id].y + 65,
            text: descrText,
            z: 10,
            multiline: true,
            font: {
                color: android.graphics.Color.WHITE,
                size: 20,
                shadow: 0
            }
        }
        changelogElements["frame" + _id].height += (descrText.split('\n').length - 1) * (changelogElements["descriptionText" + _id].font.size*1.1 + 2);
        changelogElements.last = _id;
        thisWindows["changelog"].location.setScroll(0, thisWindows["changelog"].location.windowToGlobal(_y + changelogElements["frame" + _id].height));
        if(thisWindows["changelog"].isOpened())thisWindows["changelog"].updateWindowLocation();
        return true;
    }

    function initMainChangelogVersions(){
        for(var i = 0; i < 5; i++)nextChangelog();
    }

    var newest_version = getNewestVersion();
    if(newest_version == 0)return initMainChangelogVersions();
    if(mod.version == newest_version) return initMainChangelogVersions();
    changelogEnabled = true;
    initMainChangelogVersions();

    mainElements['newVersionImage'] = {
        type: "image",
        x: tabsSettings.width + tabImageSettings.padding + tabImageSettings.size/3,
        y: (tabsSettings.height - tabImageSettings.size)/2 + tabImageSettings.size/3,
        z: 12,
        bitmap: ['newVersionImage', 'newVersionImage2', 'newVersionImage3', 'newVersionImage4', 'newVersionImage5', 'newVersionImage4', 'newVersionImage3', 'newVersionImage2'],
        scale: tabImageSettings.size*(2/3)/21 
    }
    skipButton = true;
    var jinterval;
    thisWindows['main'].setEventListener({
        onClose: function(){
            if(skipButton){
                ModInfoUI_Button_Container.openAs(ModInfoUI_Button);
                skipButton = false;
            }
            jClearInterval(jinterval);
        },
        onOpen: function(){
            jinterval = jSetInterval(runOnUiThread(function(){
                var element = thisWindows['main'].getElements().get("newVersionImage");
                if(element)createAnim([0, 5, 0], 200, function(value){
                    element.setPosition(mainElements['newVersionImage'].x, mainElements['newVersionImage'].y - value);
                })
            }, true), 3000)
        }
    })
    Callback.addCallback('PostLoaded', function(){
        switchPage('changelog');
    }, -10001);
    return;

})()