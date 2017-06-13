module dragon.panel {
	export class MainMenu extends eui.Component {
		private grp_btns: eui.Group;

		private filter_shadow: Array<egret.DropShadowFilter> = [new egret.DropShadowFilter(6, 45, 0x000000, 0.7, 16, 16, 0.65)];
		private current: eui.Button;
		public constructor() {
			super();
			this.skinName = "resource/skins/panel/subpanel/MainMenu.exml";
			this.filter_shadow
			this.grp_btns.$children.forEach((c) => {
				c.addEventListener(egret.TouchEvent.TOUCH_END, this.onChildBtnClick, this);
				this.grp_btns.getChildAt(0).filters = this.filter_shadow;
			});
		}

		protected childrenCreated() {
			this.grp_btns.$children.forEach(c => { c.filters = [] });
		}

		private onChildBtnClick(e: egret.Event) {
			let btn = <eui.Button>e.target
			if (btn === this.current)
				return;

			if (this.current) this.current.filters = []
			btn.filters = this.filter_shadow;
			view.mainscene.showPanel(btn.name);

			this.current = btn;
		}
	}
}