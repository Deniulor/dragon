module dragon.battle0 {
	export class Buff {
		private creature: Unit;
		private lv: number;

		private buffdata: any;
		public get id() {
			return this.buffdata.id;
		}

		private time: number; //生命周期，秒

		public get effect() { return this.buffdata.Effect; };
		public mc: egret.MovieClip; // 播放的特效

		protected $attrsPer: { [k: number]: number }; // 属性列表
		protected $attrsFixed: { [k: number]: number }; // 属性列表
		public attrPer(attr: enums.Attr) {
			return this.$attrsPer[attr] || 0;
		}
		public attrFixed(attr: enums.Attr) {
			return this.$attrsFixed[attr] || 0;
		}

		public constructor(creature: Unit, buffid: number, lv: number) {
			this.creature = creature;
			this.buffdata = kernel.data.group('Buff').find(buffid);
			this.lv = lv;

			this.$attrsPer = {};
			this.$attrsFixed = {};
			for (var i = 0; i < this.buffdata.AttrTypeList.length; ++i) {
				var attr = enums.Attr[this.buffdata.AttrTypeList[i]];
				if (this.buffdata.AttrFixedList[i]) {
					this.$attrsFixed[attr] = this.buffdata.AttrValueList[i] + this.buffdata.AttrIncList[i] * this.lv;
				} else {
					this.$attrsPer[attr] = (this.buffdata.AttrValueList[i] + this.buffdata.AttrIncList[i] * this.lv) / 100;
				}
			}
			this.time = 0;
		}

		public update(dt: number) {
			var pre = this.time;
			this.time += dt;
			if (this.time > this.buffdata.Time) {
				return;
			}
			if (Math.floor(pre) != Math.floor(this.time)) {
				// 过了一秒，触发buff效果
			}
		}

		public isEffective() {
			if (this.time > this.buffdata.Time) {
				return false;
			}
			if (this.buffdata.HPCondition > 0) {
				return this.creature.hp / this.creature.baseAttr(enums.Attr.HP) < this.buffdata.HPCondition / 100;
			}
			return true;
		}

		public isInCd() {
			return this.time < this.buffdata.CD;
		}
	}
}