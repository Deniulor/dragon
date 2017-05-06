module dragon.battle0 {
	export class MainBattle extends Battle {
		public constructor() {
			super();
		}

		protected createSelf(): Unit {
			return new Player(this);
		}

		protected createOppo(): Array<Unit> {
			let list = new Array<Unit>();
			for (let i = 0; i < 3; ++i) {
				list.push(new Monster(this));
			}
			return list;
		}

		protected onWin() {
			console.log('Winner!!!');
			for (let i = 0; i < this.oppos.length; ++i) {
				this.oppos[i].init();
			}
			this.start();
		}

		protected onLost() {
			console.log('Lost!!!');
			this.self.init();
			this.start();
		}

		public unload() {

		}
	}
}