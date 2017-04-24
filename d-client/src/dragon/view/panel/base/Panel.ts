module dragon.panel {
	class PanelCallbacks {
		public normalCbs: { [k: string]: (msg: any) => void } = {};
		public normalError: { [k: string]: (event: string, code: number, msg: string) => void } = {};
		public permanentCbs: { [k: string]: (msg: any) => void } = {};
		public permanentError: { [k: string]: (event: string, code: number, msg: string) => void } = {};
	}

	var eventCbs: { [k: string]: PanelCallbacks } = {};

	export function event(eventname: string, ispermanent: boolean = false, iserrcb: boolean = false) {
		return function (target: Panel, propertyKey: string, descriptor: PropertyDescriptor) {
			var panelname: string = target.getPanelName();
			var panelEvent: PanelCallbacks = eventCbs[panelname] || (eventCbs[panelname] = new PanelCallbacks());
			var events;
			if (!ispermanent && !iserrcb) {
				events = panelEvent.normalCbs;
			} else if (!ispermanent && iserrcb) {
				events = panelEvent.normalError;
			} else if (ispermanent && !iserrcb) {
				events = panelEvent.permanentCbs;
			} else if (ispermanent && iserrcb) {
				events = panelEvent.permanentError;
			}
			if (events[eventname]) {
				console.error('Panel[%s]重复注册事件:[%s], 是否持久化:[%s], 是否是错误处理:[%s].', panelname, eventname, ispermanent, iserrcb);
			}
			events[eventname] = target[propertyKey];
		};
	}

	export function CheckPanelCallbackValid() {
		for (var pname in eventCbs) {
			var panel = eventCbs[pname];
			for (var ename in panel.normalError) {
				if (!panel.normalCbs[ename]) {
					console.error('Panel[%s]注册了错误处理事件:[%s]却没相关的正常事件.持久化:[%s]', pname, ename, false);
				}
			}
			for (var ename in panel.permanentError) {
				if (!panel.permanentCbs[ename]) {
					console.error('Panel[%s]注册了错误处理事件:[%s]却没相关的正常事件.持久化:[%s]', pname, ename, true);
				}
			}
		}
	}

	export abstract class Panel extends eui.Component {
		private eventReged: boolean = false;
		private permanentReged: boolean = false;
		private regedEvent: { [k: string]: (msg: any) => void } = {};
		private layer: egret.DisplayObjectContainer;

		public constructor() {
			super();
			this.initSkin();
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			this.initTouchEvent(this);
			this.percentWidth = 100;
			this.percentHeight = 100;
		}

		public abstract getPanelName(): string;

		protected initSkin() {
			this.skinName = "resource/skins/panel/" + this.getPanelName() + '.exml';
		}


		protected initTouchEvent(node: egret.DisplayObjectContainer) {
			for (var i = 0; i < node.numChildren; i++) {
				var child = <egret.DisplayObjectContainer>node.getChildAt(i);
				if (!child) {
					continue;
				}
				if (child.name.search("^fun_close$") == 0) {
					child.addEventListener(egret.TouchEvent.TOUCH_END, () => {
						kernel.ui.$close(this.getPanelName());
					}, this);
				}
				else if (child.name.search("^fun_open_") == 0) {
					var btnName = child.name.substring(child.name.lastIndexOf("_") + 1, child.name.length);
					child.addEventListener(egret.TouchEvent.TOUCH_END, (evt: egret.TouchEvent) => {
						var touchObject = <eui.Component>evt.target;
						if (touchObject != null) {
							var tp = touchObject.name.indexOf(".");
							var index;
							var panelName = "";
							if (tp <= 0) {
								panelName = touchObject.name.substring(touchObject.name.indexOf("_") + 1, touchObject.name.length);
							} else {
								panelName = touchObject.name.substring(touchObject.name.indexOf("_") + 1, tp);
								index = touchObject.name.substring(tp + 1, touchObject.name.length);
							}
							dragon.kernel.ui.$open(panelName, index);
						}
					}, this);
				}
				this.initTouchEvent(child);
			}
		}

		public open(index: any = 0) {
			this.regEvents();
			this.onOpen(index);
			this.visible = true;
			if (this.layer) {
				this.layer.addChild(this);
			}
		}

		public close() {
			if (!this.visible) {
				return;
			}
			this.unregEvents();
			this.onClosing();
			this.visible = false;
			this.onClosed();
			if (this.parent) {
				this.layer = this.parent;
				this.parent.removeChild(this);
			}
		}

		protected onOpen(index?: any) { }//窗口被打开的时候调用
		protected onClosing() { }//窗口关闭中调用
		protected onClosed() { }//窗口关闭后调用
		public onActive() { }//窗口被置于顶层的时候调用

		private regEvents() {
			if (this.eventReged) {
				return;
			}
			var panelcallbacks = eventCbs[this.getPanelName()];
			if (!panelcallbacks) {
				return;
			}
			for (var ename in panelcallbacks.normalCbs) {
				var cb = panelcallbacks.normalCbs[ename];
				var errcb = panelcallbacks.normalError[ename];
				if (errcb) {
					errcb = errcb.bind(this);
				}
				var reg = cb.bind(this);
				this.regedEvent[ename] = reg;
				kernel.net.on(ename, reg, errcb);
			}
			this.eventReged = true;

			if (this.permanentReged) {
				return;
			}
			for (var ename in panelcallbacks.permanentCbs) {
				var cb = panelcallbacks.permanentCbs[ename];
				var errcb = panelcallbacks.permanentError[ename];
				if (errcb) {
					errcb = errcb.bind(this);
				}
				kernel.net.on(ename, cb.bind(this), errcb);
			}
			this.permanentReged = true;
		}
		private unregEvents() {
			if (this.eventReged) {
				for (var ename in this.regedEvent) {
					kernel.net.off(ename, this.regedEvent[ename]);
				}
				this.eventReged = false;
			}
		}
	}
}