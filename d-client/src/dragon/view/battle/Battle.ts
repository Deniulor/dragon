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
			let layer: eui.Group = null;
			switch (unit.group) {
				case battle0.Group.Self: layer = this.selfContainer; break;
				case battle0.Group.Oppo: layer = this.oppoContainer; break;
				case battle0.Group.Allies: layer = this.playerContainer; break;
			}
			if (!layer) return;

			layer.addChild(unit.view);
			this.layout(layer);
		}

		private layout(layer: eui.Group) {
			let cnt = layer.$children.length;
			let row = Math.ceil(cnt / 3);
			let index = 0;
			let curX = 0;
			let margin_x = 10;
			let margin_y = 10;
			for (let r = 0; r < row; ++r) {
				if (cnt <= 0)
					return;
				let cnt0 = Math.min(cnt, 3);
				let height = 0;
				let width = 0;
				for (let i = 0; i < cnt0; ++i) {
					let chd = layer.getChildAt(index + i);
					width = Math.max(width, chd.width);
					height += chd.height + margin_y;
				}
				height -= margin_y;

				for (let i = 0, curY = (layer.height - height) / 2; i < cnt0; ++i) {
					let chd = layer.getChildAt(index);
					chd.x = curX;
					chd.y = curY;
					curY += margin_y + chd.height;
					index++;
				}
				curX += width + margin_x;
			}
		}

		public refresh(): void {

		}
	}
}