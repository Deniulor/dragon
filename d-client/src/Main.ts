
class Main extends eui.UILayer {

    protected createChildren(): void {
        super.createChildren();
        egret.TextField.default_fontFamily = "黑体";
        if (dragon.utils.tools.platform() == dragon.utils.tools.Platform.PC) {
            this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
            this.stage.orientation = egret.OrientationMode.AUTO;
            document.body.style.height = '100%';
        }

        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter", assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json?v=" + window['DRAGON_VERSION'], "resource/");
    }

    // 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // 加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/default.thm.json?v=" + window['DRAGON_VERSION'], this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
        // 加载基础界面资源
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.loadGroup("loading");
    }

    // 主题文件加载完成,开始加载主题文件
    private isThemeLoadEnd: boolean = false;
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            this.startCreateScene();
        }
    }

    // 主题文件加载完成,开始加载loading资源组
    private isResourceLoadEnd: boolean = false;
    private onResourceLoadError(event: RES.ResourceEvent): void {
        console.warn("Group:" + event.groupName + " has failed to load");
        this.onResourceLoadComplete(event); //忽略加载失败的项目
    }


    //loading资源组加载完成
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);

        // console.log("[ResLoad] group 'loading' load over");
        this.isResourceLoadEnd = true;
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            this.startCreateScene();
        }
    }

    // 创建场景界面
    protected startCreateScene(): void {
        this.clearLoadingTips();

        //初始化游戏内核
        dragon.kernel.init();
        dragon.kernel.ui.init(this); //设置 root layer
        dragon.player.init();
        dragon.utils.tools.initModel(dragon.manager);

        // 进入开始界面
        dragon.kernel.ui.loadScene(new dragon.view.StartScene());
    }

    private clearLoadingTips() {
        var tip = document.getElementById('___preloading');
        tip.parentNode.removeChild(tip);
    }
}
