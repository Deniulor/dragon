module dragon.panel {
	export class Login extends Panel {
		private btn_start: eui.Image;
		private lbl_server: eui.Label;
		private lbl_status: eui.Label;
		private img_hot: eui.Image;
		private img_new: eui.Image;
		private lbl_version: eui.Label;

		public getPanelName(): string { return 'Login'; }
		public constructor() {
			super();
			this.btn_start.addEventListener(egret.TouchEvent.TOUCH_END, this.startGame, this);
			this.lbl_version.text = 'version:' + window['LEGEND_VERSION']; //游戏加载完成后初始化SDK
		}

		private startGame(evt: egret.TouchEvent) {
			kernel.ui.loadScene(view.mainscene);
			this.close();
		}
	}
}