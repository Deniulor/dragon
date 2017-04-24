module dragon.battle0 {
	// 阵营
	export enum Group {
		None, Player, Creep, Allies
	}

	export class Unit {
		private $id: number;
		public get id() { return this.$id }

		private $battle;
		public get battle() { return this.$battle }
		protected $view: view.Unit;
		public get view(): view.Unit { return this.$view; }

		public get x(): number { return this.$view.x; }
		public set x(value: number) { this.$view.x = value; }
		public get y(): number { return this.$view.y; }
		public set y(value: number) { this.$view.y = value; }

		public Group: battle0.Group;

		private $hp;
		public get hp() { return this.$hp }
		public set hp(value: number) { this.$hp = value; }
		public get dead() { return this.$hp > 0 }


		protected skillLauncher: SkillLauncher;
		protected buffs: { [k: number]: Buff };
		protected $attrs: { [k: number]: number }; // 属性列表

		/** 
		 * attr 属性类型
		 * value 若传参则认为是set操作
		 */
		public attr(attr: model.Attribute, value?: number) {
			if (value != undefined) {
				this.$attrs[attr] = value;
			}
			var base = this.$attrs[attr] || 0;
			var per = 0;
			var fixed = 0;
			for (var k in this.buffs) {
				var buff = this.buffs[k];
				if (!buff.isEffective()) {
					continue;
				}
				per += buff.attrPer(attr);
				fixed += buff.attrFixed(attr);
			}
			return base * (1 + per) + fixed;
		}

		public baseAttr(attr: model.Attribute) {
			return this.$attrs[attr] || 0;
		}


		public hit(tar: Unit) {
			var hitchance = this.attr(model.Attribute.Hit) / (this.attr(model.Attribute.Hit) + tar.attr(model.Attribute.Dodge));
			hitchance = hitchance + (this.attr(model.Attribute.HitPro) - tar.attr(model.Attribute.DodgePro)) / 100.0;
			return this.battle.random() < hitchance;
		}

		public critical(tar: Unit) {
			var critchance = this.attr(model.Attribute.Critical) / (this.attr(model.Attribute.Critical) + tar.attr(model.Attribute.Tenacity));
			critchance = critchance + (this.attr(model.Attribute.CriticalPro) - tar.attr(model.Attribute.TenacityPro)) / 100.0;
			return this.battle.random() < critchance;
		}

		public addBuff(buff: Buff) {
			var pre = this.buffs[buff.id];
			if (pre) {
				if (pre.isInCd()) return;
				this.$view.removeBuff(pre);
			}
			this.buffs[buff.id] = buff;
			this.$view.addBuff(buff);
		}

		public removeBuff(buffidList: Array<number>) {
			for (var i = 0; i < buffidList.length; ++i) {
				var buffid = buffidList[i];
				var pre = this.buffs[buffid];
				delete this.buffs[buffid];
				if (pre) {
					this.$view.removeBuff(pre);
				}
			}
			this.$hp = Math.min(this.$hp, this.attr(model.Attribute.MaxHP));
		}

		public damage(damage: number, source: battle0.Unit) {
			this.hp -= damage;
			if (this.dead) {
				this.die();
			}
		}

		public heal(heal: number) {
			this.hp = Math.min(this.attr(model.Attribute.MaxHP), this.hp + heal);
		}
		
		protected die() {
			this.$view.onDie();
			this.$battle.onDie(this);
		}

		public isFriend(ch: Unit) {
			if (this.Group == ch.Group)
				return true;
			return (this.Group == Group.Player && ch.Group == Group.Allies)
				|| (this.Group == Group.Allies && ch.Group == Group.Player);
		}

		public constructor() {
		}
	}
}