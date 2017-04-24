module dragon {
	class BattleManager {

		public $current: battle0.Battle;

		public get current() {
			return this.$current;
		}

		public enter<T extends battle0.Battle>(clazz: { new (): T; }, param?: any): battle0.Battle {
			// var battle = <T>this.battleCache[clazz.prototype.getBattleType()];
			// if (!battle) {
			// 	battle = <T>Object.create(clazz.prototype);
			// 	battle.constructor.apply(battle); //调用构造函数
			// 	this.battleCache[clazz.prototype.getBattleType()] = battle;
			// }

			let battle = <T>Object.create(clazz.prototype);
			battle.constructor.apply(battle); //调用构造函数

			if (this.current && this.current != battle) {
				this.current.unload();
			}
			battle.load(param);
			view.mainscene.setBattle(battle.view);
			battle.start();

			this.$current = battle;
			return null;
		}

		public enterMain(): battle0.Battle {
			return this.enter(battle0.MainBattle);
		}
	}
	export const battle: BattleManager = new BattleManager();
}