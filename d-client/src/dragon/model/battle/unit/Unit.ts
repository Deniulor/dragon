module dragon.battle0 {
	// 阵营
	export enum Group {
		None, Self, Oppo, Allies
	}

	export abstract class Unit {

		protected $view: view.Unit;
		public get view(): view.Unit { return this.$view; }
		public get x(): number { return this.$view.pos.x; }
		public get y(): number { return this.$view.pos.y; }

		protected $id: number;
		protected name: string;
		public get id() { return this.$id }
		private $battle: Battle;
		public get battle() { return this.$battle }

		public group: battle0.Group;
		protected $hp;
		public get hp() { return this.$hp }
		public set hp(value: number) { this.$hp = value; this.$view.onHpChanged() }
		public get dead() { return this.$hp <= 0 }

		protected skillLauncher: SkillLauncher;
		protected buffs: { [k: number]: Buff };
		protected $attrs: { [k: number]: number }; // 属性列表


		constructor(battle: Battle) {
			this.$battle = battle;
			this.skillLauncher = new SkillLauncher(this);
			this.$attrs = {};
			this.buffs = {};
		}

		/** 
		 * attr 属性类型
		 * value 若传参则认为是set操作
		 */
		public attr(attr: enums.Attribute, value?: number) {
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

		public baseAttr(attr: enums.Attribute) {
			return this.$attrs[attr] || 0;
		}


		public hit(tar: Unit) {
			var hitchance = this.attr(enums.Attribute.Hit) / (this.attr(enums.Attribute.Hit) + tar.attr(enums.Attribute.Dodge));
			hitchance = hitchance + (this.attr(enums.Attribute.HitPro) - tar.attr(enums.Attribute.DodgePro)) / 100.0;
			return this.battle.random() < hitchance;
		}

		public critical(tar: Unit) {
			var critchance = this.attr(enums.Attribute.Critical) / (this.attr(enums.Attribute.Critical) + tar.attr(enums.Attribute.Tenacity));
			critchance = critchance + (this.attr(enums.Attribute.CriticalPro) - tar.attr(enums.Attribute.TenacityPro)) / 100.0;
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
			this.$hp = Math.min(this.$hp, this.attr(enums.Attribute.MaxHP));
		}

		public damage(damage: number, source: battle0.Unit) {
			this.hp -= damage;
			if (this.dead) {
				this.die();
			}
		}

		public heal(heal: number) {
			this.hp = Math.min(this.attr(enums.Attribute.MaxHP), this.hp + heal);
		}

		protected die() {
			this.$view.onDie();
			this.$battle.onDie(this);
		}

		public isFriend(ch: Unit) {
			if (this.group == ch.group)
				return true;
			return (this.group == Group.Self && ch.group == Group.Allies)
				|| (this.group == Group.Allies && ch.group == Group.Self);
		}

		public update(dt: number): void {
			// 技能更新
			this.skillLauncher.update(dt);
			// buff刷新
			for (var k in this.buffs) {
				var buff = this.buffs[k];
				buff.update(dt);
				if (!buff.isInCd() && !buff.isEffective()) {
					delete this.buffs[k];
				}
				if (buff.isEffective()) {
					this.$view.addBuff(buff);
				} else {
					this.$view.removeBuff(buff);
				}
			}
		}

		public castSkill() {
			if (this.dead) return;
			return this.skillLauncher.castSkill();
		}
	}
}