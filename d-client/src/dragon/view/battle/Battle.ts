module dragon.view {

	export class Battle extends eui.Component {
		private battle: dragon.battle0.Battle;

		private $effectLayer: egret.DisplayObjectContainer;
		public get effectLayer() { return this.$effectLayer }

		private selfContainer: eui.Group;
		private playerContainer: eui.Group;
		private oppoContainer: eui.Group;

		constructor(battle: dragon.battle0.Battle) {
			super();
			this.skinName = "resource/skins/battle/Battle.exml";
			this.battle = battle;

			this.$effectLayer = new egret.DisplayObjectContainer();
			this.addChild(this.$effectLayer);

			this.init();
		}

		public init() {
			this.$effectLayer.removeChildren();

			this.selfContainer.removeChildren();
			this.playerContainer.removeChildren();
			this.oppoContainer.removeChildren();
		}

		public addEffect(effect: egret.DisplayObject) {
			this.$effectLayer.addChild(effect);
		}

		public addUnit(unit: battle0.Unit) {
			switch (unit.group) {
				case battle0.Group.Self: this.selfContainer.addChild(unit.view); return;
				case battle0.Group.Oppo: this.oppoContainer.addChild(unit.view); return;
				case battle0.Group.Allies: this.playerContainer.addChild(unit.view); return;
			}
		}

		public refresh(): void {

		}
	}
}