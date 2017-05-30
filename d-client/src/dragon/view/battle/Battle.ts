module dragon.view {
	export class Battle extends eui.Component {
		private battle: dragon.battle0.Battle;

		private $effectLayer: egret.DisplayObjectContainer;
		private units: egret.DisplayObjectContainer;
		public get effectLayer() { return this.$effectLayer }

		constructor(battle: dragon.battle0.Battle) {
			super();
			this.skinName = "resource/skins/battle/Battle.exml";
			this.battle = battle;

			this.units.$children.forEach(c => c.visible = false);

			this.$effectLayer = new egret.DisplayObjectContainer();
			this.addChild(this.$effectLayer);


			this.init();
		}

		public init() {
			this.$effectLayer.removeChildren();
		}

		public addEffect(effect: egret.DisplayObject) {
			this.$effectLayer.addChild(effect);
		}

		public addUnit(unit: battle0.Unit) {
			let loc = this.units.getChildByName(enums.Group[unit.group].toLowerCase())
			unit.view.x = loc.x
			unit.view.y = loc.y
			this.units.addChild(unit.view);
		}

		public refresh(): void {

		}
	}
}