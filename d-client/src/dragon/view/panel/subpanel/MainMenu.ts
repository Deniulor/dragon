module dragon.panel {
	export class MainMenu extends eui.Component {
		private grp_btns: eui.Group;

		public constructor() {
			super();
			this.skinName = "resource/skins/panel/subpanel/MainMenu.exml";
			this.grp_btns.$children.forEach((c) => {
				c.addEventListener(egret.TouchEvent.TOUCH_END, this.onChildBtnClick, c);
			});
		}

		private onChildBtnClick(e: egret.Event) {
			view.mainscene.showPanel((<eui.Button>e.target).name);
		}
	}
}