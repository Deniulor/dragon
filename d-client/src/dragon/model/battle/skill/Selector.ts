module dragon.battle0 {
	export class Selector {
		private targetSelect: (me: Unit, tar: Unit) => boolean;
		private castSelect: (me: Unit, tar: Unit) => boolean;
		private strategy: (me: Unit, tar: Unit, tar2: Unit) => Unit;

		public constructor(selectTarget: string, strategy: string, castTarget: string, area: string, param: string) {

			this.targetSelect = (selector.target[selectTarget] || selector.target.Enemy);
			this.castSelect = (selector.target[castTarget] || selector.target.Enemy);
			this.strategy = (selector.strategy[strategy] || selector.strategy.HpMin);
		}

		public select(me: Unit, all: Array<Unit>): { selected: Unit, caston: Array<Unit> } {
			var toSelectCast: Array<Unit> = [];
			var target: Unit = null;
			all.forEach((e: Unit, i: number, arry: Array<Unit>) => {
				if (e.dead) return;
				if (this.castSelect(me, e)) {
					toSelectCast.push(e);
				}
				if (this.targetSelect(me, e)) {
					target = (target == null ? e : this.strategy(me, target, e));
				}
			});
			return { selected: target, caston: toSelectCast };
		}
	}

	namespace selector.target {
		export const Self = (me: Unit, e: Unit) => { return me == e; }
		export const Alias = (me: Unit, e: Unit) => { return me != e && me.isFriend(e); }
		export const SelfAndAlias = (me: Unit, e: Unit) => { return me == e || me.isFriend(e); }
		export const Group = (me: Unit, e: Unit) => { return me == e || me.group == e.group; }
		export const Enemy = (me: Unit, e: Unit) => { return me != e && !me.isFriend(e); }
	}

	namespace selector.strategy {
		export const HpMin = (me: Unit, tar1: Unit, tar2: Unit) => {
			return tar1.hp / tar1.attr(enums.Attribute.MaxHP) < tar2.hp / tar2.attr(enums.Attribute.MaxHP) ? tar1 : tar2
		}
	}
}