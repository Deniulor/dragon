module dragon.battle0 {
	export class MainBattle extends Battle {
		public constructor() {
			super();
		}

		protected initSelf(): Unit {
			return new Player(this);
		}

		protected initOppo(): Array<Unit> {
			let list = new Array<Unit>();
			for (let i = 0; i < 3; ++i) {
				list.push(new Monster(this));
			}
			return list;
		}

		protected onWin() {
			console.log('Winner!!!');
		}
		protected onLost() {
			console.log('Lost!!!');
		}

		public unload() {

		}
	}
}