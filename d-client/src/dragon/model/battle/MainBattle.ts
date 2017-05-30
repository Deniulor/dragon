module dragon.battle0 {
	export class MainBattle extends Battle {
		public constructor() {
			super();
		}

		protected createPlayer(): Unit {
			return new Player(this);
		}
		protected createPet(): Unit {
			return;
		}
		protected createMonster(): Unit {
			return new Monster(this);
		}

		protected onWin() {
			console.log('Winner!!!');
			this.monster.init();
			this.start();
		}

		protected onLost() {
			console.log('Lost!!!');
			this.player.init();
			this.start();
		}

		public unload() {

		}
	}
}