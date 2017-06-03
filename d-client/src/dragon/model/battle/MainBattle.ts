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
			egret.setTimeout(this.player.reborn, this.player, 100);
			egret.setTimeout((this.restart), this, 1000);
		}

		protected onLost() {
			console.log('Lost!!!');
			egret.setTimeout(this.player.reborn, this.player, 100);
			egret.setTimeout((this.restart), this, 3000);
		}

		private restart() {
			this.monster.init();
			this.start()
		}

		public unload() {

		}
	}
}