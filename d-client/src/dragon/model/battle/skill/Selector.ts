module dragon.battle0 {
	export class Selector {
		private targetSelect: (me: Unit, tar: Unit) => boolean;
		private castSelect: (me: Unit, tar: Unit) => boolean;
		private strategy: (me: Unit, tar: Unit, tar2: Unit) => Unit;
		private area: (target: Unit, all: Array<Unit>, param: any) => Array<Unit>;
		private areaParam: any;

		public constructor(selectTarget: string, strategy: string, castTarget: string, area: string, param: string) {
			this.targetSelect = (selector.target[selectTarget] || selector.target.Enemy);
			this.castSelect = (selector.target[castTarget] || selector.target.Enemy);
			this.strategy = (selector.strategy[strategy] || selector.strategy.Closest);
			this.area = (selector.area[area] || selector.area.Single);
			this.areaParam = (param && JSON.parse(param));
		}

		public select(me: Unit, all: Array<Unit>): { selected: Unit, castOn: Array<Unit> } {
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
			return { selected: target, castOn: target ? this.area(target, toSelectCast, this.areaParam) : null };
		}
	}

	namespace selector.target {
		export const Self = (me: Unit, e: Unit) => { return me == e; }
		export const Alias = (me: Unit, e: Unit) => { return me != e && me.isFriend(e); }
		export const SelfAndAlias = (me: Unit, e: Unit) => { return me == e || me.isFriend(e); }
		export const Group = (me: Unit, e: Unit) => { return me == e || me.Group == e.Group; }
		export const Enemy = (me: Unit, e: Unit) => { return me != e && !me.isFriend(e); }
	}

	namespace selector.strategy {
		export const HpMin = (me: Unit, tar1: Unit, tar2: Unit) => {
			return tar1.hp / tar1.attr(model.Attribute.MaxHP) < tar2.hp / tar2.attr(model.Attribute.MaxHP) ? tar1 : tar2
		}
		export const Closest = (me: Unit, tar1: Unit, tar2: Unit) => {
			return distance0(me, tar1) < distance0(me, tar2) ? tar1 : tar2
		}
	}

	namespace selector.area {
		export const Single = (target: Unit, all: Array<Unit>, param) => { return [target] }
		export const All = (target: Unit, all: Array<Unit>, param) => { return all }
		export const Circle = (target: Unit, all: Array<Unit>, param) => {
			var d = param.radius * param.radius;
			return all.filter((c) => distance0(target, c) <= d);
		}
	}

	/// 并没有计算真正的距离
	function distance0(c1: Unit, c2: Unit) {
		var dx = c1.x - c2.x;
		var dy = c1.y - c2.y;
		return dx * dx + dy * dy;
	}
}