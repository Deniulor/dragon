namespace dragon.kernel0 {
    export interface IUiManager {
        /**
         *  初始化场景类
         */
        init(root: eui.UILayer): void;
        open<T extends panel.Panel>(panel: { new (): T; }, param?: any): T;
        close<T extends panel.Panel>(panel: { new (): T; }): T;
        /**
         * 关闭所有窗口，不激活active事件 
         * */
        closeAll(): number;
        loadScene(scene: eui.Component);

        $open(panelName: string, param?: any): panel.Panel;
        $close(panel: string): panel.Panel;

        /*
        *   获得某个界面
         */
        getPanel(panelName: string, pool: string)

        // noticeLayer 公告层 如 跑马灯 提示之类 类的
        noticeLayer: eui.UILayer;
    }

    export class UI implements IUiManager {
        // root 所有的层级的父节点
        private root: eui.UILayer;

        // sceneLayer 场景层 如 战场、主城、副本战场之类的
        private sceneLayer: eui.UILayer = new eui.UILayer();

        // mainLayer 主UI层 如 底部功能栏
        public mainLayer: eui.UILayer = new eui.UILayer();

        // panelLayer 弹窗层 如 设置、背包、装备之类的
        public panelLayer: eui.UILayer = new eui.UILayer();

        // noticeLayer 公告层 如 跑马灯 提示之类 类的
        public noticeLayer: eui.UILayer = new eui.UILayer();

        // maskLayer 通讯遮罩层 和服务器通讯UI
        public maskLayer: eui.UILayer = new eui.UILayer();

        // loadLayer 加载遮罩层 场景切换的时候加载资源UI
        public loadLayer: eui.UILayer = new eui.UILayer();

        private panelPool: { [k: string]: dragon.panel.Panel } = {};
        private mainPool: { [k: string]: dragon.panel.Panel } = {};

        public getPanel(panelName: string, pool: string = 'panelPool') {
            if (!this[pool]) return false;
            var asd = this[pool];
            var dsasd = this[pool][panelName];
            return this[pool][panelName];
        }

        public init(root: eui.UILayer): void {
            this.root = root;
            this.root.touchThrough = true;
            this.sceneLayer.touchThrough = true;
            this.mainLayer.touchThrough = true;
            this.panelLayer.touchThrough = true;
            this.noticeLayer.touchThrough = true;
            this.noticeLayer.touchEnabled = false;
            this.maskLayer.touchThrough = true;
            this.loadLayer.touchThrough = true;
            this.root.addChild(this.sceneLayer);
            this.root.addChild(this.mainLayer);
            this.root.addChild(this.panelLayer);
            this.root.addChild(this.noticeLayer);
            this.root.addChild(this.maskLayer);
            this.root.addChild(this.loadLayer);
            dragon.panel.CheckPanelCallbackValid();
            dragon.view.mainscene.init();
        }

        public open<T extends panel.Panel>(clazz: { new (): T; }, param: any = 0): T {
            var layer = this.panelLayer;
            var panelName = clazz.prototype.getPanelName();
            var panel = this.panelPool[panelName];
            if (!panel) {
                panel = Object.create(clazz.prototype);
                panel.constructor.apply(panel); //调用构造函数
                layer.addChildAt(panel, layer.numChildren);
                this.panelPool[panelName] = panel;
            }
            panel.open(param);
            layer.setChildIndex(panel, layer.numChildren);
            panel.onActive();
            return <T>panel;
        }

        public $open(panelName: string, param: any = 0) {
            var layer = this.panelLayer;
            var panel = this.panelPool[panelName];
            if (!panel) {
                var clazz = window["legend"]["panels"][panelName];
                if (!clazz) {
                    console.error('Panel:[legent.panels.' + panelName + "]NotDefined");
                    return;
                }
                panel = Object.create(clazz.prototype);
                panel.constructor.apply(panel); //调用构造函数
                layer.addChildAt(panel, layer.numChildren);
                this.panelPool[panelName] = panel;
            }
            panel.open(param);
            layer.setChildIndex(panel, layer.numChildren);
            panel.onActive();
            return panel;
        }

        public $close(panelName: string): panel.Panel {
            var panel = this.panelPool[panelName];
            if (panel) {
                panel.close();
                var idx = this.panelLayer.numChildren - 1;
                while (idx >= 0) {
                    var top = <panel.Panel>this.panelLayer.getChildAt(idx--);
                    if (top.visible) {
                        top.onActive();
                        break;
                    }
                }
            }
            return panel
        }

        public close<T extends panel.Panel>(clazz: { new (): T; }): T {
            return <T>this.$close(clazz.prototype.getPanelName());
        }

        /**
         * 关闭所有窗口，不激活active事件
         * */
        public closeAll() {
            var idx = this.panelLayer.numChildren - 1;
            var count = 0;
            while (idx >= 0) {
                var top = <panel.Panel>this.panelLayer.getChildAt(idx--);
                if (top.visible) {
                    top.close();
                    count++;
                }
            }
            return count;
        }

        public loadScene(scene: view.Scene) {
            if (this.sceneLayer.contains(scene)) {
                return;
            }
            var preScene: Array<view.Scene> = [];
            var sceneLayer = this.sceneLayer;
            var mainLayer = this.mainLayer;
            for (var i = 0; i < sceneLayer.numChildren; ++i) {
                preScene.push(<view.Scene>sceneLayer.getChildAt(i));
            }
            scene.beforeLoad();
            sceneLayer.addChild(scene);
            this.mainPool = {};
            scene.afterLoaded();

            preScene.forEach(function (pre) {
                pre.beforRemove();
                sceneLayer.removeChild(pre);
                pre.afterRemoved();
            });
        }
    }
}