module dragon.view {
	class MainScene extends Scene {

		private battle: Battle;

		public constructor() {
			super();
		}

		public init() {
			this.skinName = 'resource/skins/scene/Main.exml';
			this.percentHeight = 100;
			this.percentWidth = 100;
		}

		public afterLoaded() {
			if (this.battle instanceof Battle)
				return;
			this.setBattle(new Battle(dragon.battle.enterMain()));
		}

		public setBattle(battle: Battle) {
			if (this.battle) {
				this.removeChild(this.battle);
			}
			//left="0" right="0" top="150" bottom="426"
			battle.left = battle.right = 0;
			battle.top = 160, battle.bottom = 426;
			this.battle = battle;
			this.addChild(this.battle);
		}
	}
	export const mainscene = new MainScene();
}