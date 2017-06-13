module dragon.view {
	export class StartScene extends Scene {
		private bg: egret.Bitmap = new egret.Bitmap();
		public constructor() {
			super();
			// UI界面
			this.addChild(this.bg);
			this.bg.texture = RES.getRes("login_bg_jpg");

			var loading = kernel.ui.open(panel.Loading); // 打开loading界面
			loading.startLoading(this.onAllLoaded.bind(this)); // 进行加载
		}

		private onAllLoaded() {
			this.beforeStart();
			kernel.ui.close(panel.Loading);
			kernel.ui.open(panel.Login);
		}

		private beforeStart() {
			dragon.utils.tools.initModel(dragon.manager);
		}
	}
}