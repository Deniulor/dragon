module dragon.panel {
	export class Loading extends Panel {

		public getPanelName(): string { return 'Loading'; }
		private processBar: eui.Image;
		private loadingLight: eui.Image;
		private zl_logo: eui.Image;
		private textField: egret.TextField;

		protected initSkin() {
			//super.initSkin();
			var w = egret.MainContext.instance.stage.stageWidth;
			var h = egret.MainContext.instance.stage.stageHeight;

			var group = new eui.Group();
			group.width = 640;
			group.height = 432;
			group.horizontalCenter = 0;
			group.bottom = 0;
			this.addChild(group);

			// 	<e:Label text="努力加载中..." y="953" size="22" textAlign="left" strokeColor="0x000000" stroke="1" textColor="0xFFFFFF" horizontalCenter="0.5"/>
			this.textField = new egret.TextField();
			this.textField.text = "努力加载中...";
			this.textField.y = 186;
			this.textField.size = 22;
			this.textField.textAlign = "left";
			this.textField.stroke = 2;
			this.textField.strokeColor = 0x000000;
			this.textField.textColor = 0xFFFFFF;
			this.textField.x = group.width / 2;
			this.textField.anchorOffsetX = this.textField.width / 2;
			group.addChild(this.textField);

			// <e:Image source="loading_bg_png" y="975" horizontalCenter="0"/>
			var pgBg = new egret.Bitmap;
			pgBg.texture = RES.getRes("loading_bg_png");
			pgBg.y = 212;
			pgBg.x = w / 2 - pgBg.width / 2;
			group.addChild(pgBg);

			// <e:Image id="processBar" source="loading_line_jpg" y="992" left="109" x="109" scaleX="1" scaleY="1"/>
			this.processBar = new eui.Image;
			this.processBar.texture = RES.getRes("loading_line_jpg");
			this.processBar.left = 109;
			this.processBar.x = 109;
			this.processBar.y = 229;
			this.processBar.scaleX = 0;
			group.addChild(this.processBar);

			// <e:Image id="loadingLight" source="loading_light_png" x="521" y="965"/>
			this.loadingLight = new eui.Image;
			this.loadingLight.texture = RES.getRes("loading_light_png");
			this.loadingLight.x = 109;
			this.loadingLight.y = 236;
			this.loadingLight.height = 32;
			this.loadingLight.anchorOffsetX = 12.5;
			this.loadingLight.anchorOffsetY = 16;

			this.refreshTip();
		}


		// private groups: Array<string> = ["data", "preload", "effect", "icon", "fnt"];
		private groups: Array<string> = ["data", "preload"];
		private totalItems = -1;
		private loadItem = 0;
		private loadGroup = 0;
		private loadCallback: () => void;

		public startLoading(cb: () => void) {
			this.loadGroup = 0;
			RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onComplete, this);
			RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onProgress, this);
			RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onError, this);
			RES.getGroupByName('');
			var self = this;
			self.groups.forEach((g) => {
				RES.loadGroup(g);
				self.totalItems += RES.getGroupByName(g).length;
			});
			self.loadCallback = cb;
		}

		private onProgress(event: RES.ResourceEvent): void {
			this.loadItem++;
			if (this.processBar && this.loadingLight) {
				this.processBar.scaleX = this.loadItem / this.totalItems;
				this.loadingLight.left = this.processBar.left + this.processBar.width * this.processBar.scaleX - 15;
			}
			if (event.groupName == 'data') {
				dragon.kernel.data.add(event.resItem.name, event.resItem.data);
			}
			this.refreshTip();
		}

		private onError(event: RES.ResourceEvent): void {
			console.warn("Group:" + event.groupName + " has failed to load");
			this.onComplete(event); //忽略加载失败的项目
		}

		//loading资源组加载完成
		private onComplete(event: RES.ResourceEvent): void {
			this.loadGroup++;
			if (this.loadGroup == this.groups.length) {
				RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onComplete, this);
				RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onError, this);
				RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onProgress, this);
				if (this.loadCallback) this.loadCallback();
			}
		}

		private timeIndex: number;
		private refreshTip() {
			if (this.timeIndex) return;
			this.timeIndex = egret.setTimeout(() => {
				this.timeIndex = null;
			}, this, 2000);
			var tip = ["神装熔炼掉是不会损失神装碎片的哦",
				"将一键熔炼旁边的勾勾去掉，可以熔炼全部装备",
				"挑战关主成功可以获得元宝",
				"决战排行和竞技场排行每日4点清算",
				"完成每日任务可以获得大量奖励",
				"决战中击败别人有几率抢夺他身上的藏宝图",
				"40级就可以开启第二个门派角色",
				"强化、升星、宝石都是锁定在部位上，换装备不会损失",
				"点击自动战斗会帮您自动挑战关主",
				"升级翅膀有几率暴击获得双倍经验哦",
				"当您不知道如何强化自己时，请跟着小红点走",
				"离线也会有经验哦，在您重新登录时就会获取",
			];
			if (tip && tip.length > 0) {
				this.textField.text = tip[Math.floor(Math.random() * tip.length)];
				this.textField.anchorOffsetX = this.textField.width / 2;
			}
		}
	}
}