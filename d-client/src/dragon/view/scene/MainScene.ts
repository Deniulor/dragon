module dragon.view {
	class MainScene extends Scene {

		private battle: Battle;
		private recorder: egret.DisplayObject;
		private attribute: egret.DisplayObject;

		public constructor() {
			super();
		}

		public init() {
			this.skinName = 'resource/skins/scene/Main.exml';

			let recorder = new Recorder();
			recorder.x = this.recorder.x;
			recorder.y = this.recorder.y;
			recorder.width = this.recorder.width;
			recorder.height = this.recorder.height;
			this.recorder.visible = false;
			this.addChild(this.recorder = recorder)


			let attribute = new Attribute();
			attribute.x = this.attribute.x;
			attribute.y = this.attribute.y;
			attribute.width = this.attribute.width;
			attribute.height = this.attribute.height;
			this.attribute.visible = false;
			this.addChild(this.attribute = attribute)
		}

		public afterLoaded() {
			if (this.battle instanceof Battle)
				return;
			this.setBattle(dragon.battle.enterMain().view);
		}

		public setBattle(battle: Battle) {
			if (this.battle === battle) {
				return;
			}
			if (this.battle) {
				battle.x = this.battle.x;
				battle.y = this.battle.y;
				battle.width = this.battle.width;
				battle.height = this.battle.height;
				this.removeChild(this.battle);
			}
			this.battle = battle;
			this.addChild(this.battle);
		}
	}
	export const mainscene = new MainScene();
}