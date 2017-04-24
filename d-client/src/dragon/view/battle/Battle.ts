module dragon.view {

	export class Battle extends eui.Component {
		private battle: dragon.battle0.Battle;

		private unitLayer: egret.DisplayObjectContainer;
		private $effectLayer: egret.DisplayObjectContainer;
		public get effectLayer() { return this.$effectLayer }

		constructor(battle: dragon.battle0.Battle) {
			super();
			this.battle = battle;

			this.unitLayer = new egret.DisplayObjectContainer();
			this.addChild(this.unitLayer);

			this.$effectLayer = new egret.DisplayObjectContainer();
			this.addChild(this.$effectLayer);
		}

		public init() {
			this.$effectLayer.removeChildren();
			this.unitLayer.removeChildren();
		}
	}
}