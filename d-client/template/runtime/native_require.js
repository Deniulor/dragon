
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/res/res.js",
	"libs/modules/eui/eui.js",
	"libs/modules/game/game.js",
	"libs/modules/tween/tween.js",
	"libs/modules/socket/socket.js",
	"bin-debug/dragon/model/battle/Battle.js",
	"bin-debug/dragon/model/battle/unit/Unit.js",
	"bin-debug/dragon/view/panel/base/Panel.js",
	"bin-debug/dragon/view/scene/Sence.js",
	"bin-debug/dragon/model/bean/UniformItem.js",
	"bin-debug/dragon/kernel/Network.js",
	"bin-debug/dragon/kernel/Res.js",
	"bin-debug/dragon/kernel/UI.js",
	"bin-debug/AssetAdapter.js",
	"bin-debug/dragon/model/battle/BattleManager.js",
	"bin-debug/dragon/model/battle/Buff.js",
	"bin-debug/dragon/model/battle/Bullet.js",
	"bin-debug/dragon/model/battle/Config.js",
	"bin-debug/dragon/model/battle/MainBattle.js",
	"bin-debug/dragon/model/battle/Recorder.js",
	"bin-debug/dragon/model/battle/skill/Selector.js",
	"bin-debug/dragon/model/battle/skill/Settler.js",
	"bin-debug/dragon/model/battle/skill/Skill.js",
	"bin-debug/dragon/model/battle/skill/SkillLauncher.js",
	"bin-debug/dragon/model/battle/unit/Monster.js",
	"bin-debug/dragon/model/battle/unit/Player.js",
	"bin-debug/dragon/kernel/Effect.js",
	"bin-debug/dragon/model/bean/Player.js",
	"bin-debug/dragon/model/bean/Reward.js",
	"bin-debug/dragon/kernel/Data.js",
	"bin-debug/dragon/model/enums/Attr.js",
	"bin-debug/dragon/model/enums/Group.js",
	"bin-debug/dragon/model/enums/ItemType.js",
	"bin-debug/dragon/model/enums/Quality.js",
	"bin-debug/dragon/model/enums/Unit.js",
	"bin-debug/dragon/model/manager/Drop.js",
	"bin-debug/dragon/model/manager/Notice.js",
	"bin-debug/dragon/model/manager/Package.js",
	"bin-debug/dragon/model/utils/Number.js",
	"bin-debug/dragon/model/utils/String.js",
	"bin-debug/dragon/model/utils/Time.js",
	"bin-debug/dragon/model/utils/Tools.js",
	"bin-debug/dragon/view/battle/Attribute.js",
	"bin-debug/dragon/view/battle/Battle.js",
	"bin-debug/dragon/view/battle/Recorder.js",
	"bin-debug/dragon/view/battle/Unit.js",
	"bin-debug/dragon/kernel/Kernel.js",
	"bin-debug/dragon/view/panel/Loading.js",
	"bin-debug/dragon/view/panel/Login.js",
	"bin-debug/dragon/view/scene/MainScene.js",
	"bin-debug/dragon/kernel/LocalStorage.js",
	"bin-debug/dragon/view/scene/StartScene.js",
	"bin-debug/Main.js",
	"bin-debug/ThemeAdapter.js",
	//----auto game_file_list end----
];

var window = {};

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "showAll",
		contentWidth: 640,
		contentHeight: 1136,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};