module dragon.battle0 {
	export abstract class Unit {

		protected $view: view.Unit;
		public get view(): view.Unit { return this.$view; }
		public get x(): number { return this.$view.pos.x; }
		public get y(): number { return this.$view.pos.y; }

		protected $id: number;
		public get id() { return this.$id }
		protected $name: string;
		public get name(): string { return this.$name }
		public $color: string = '#747474'
		public get color(): string { return this.$color }
		private $battle: Battle;
		public get battle() { return this.$battle }

		public group: enums.Group;
		protected $hp;
		public get hp() { return this.$hp }
		public set hp(value: number) { this.$hp = value; this.$view.onHpChanged() }
		protected $mp;
		public get mp() { return this.$mp }
		public set mp(value: number) { this.$mp = value; this.$view.onMpChanged() }
		public get dead() { return this.$hp <= 0 }

		protected skillLauncher: SkillLauncher;
		protected buffs: { [k: number]: Buff };
		protected $attrs: { [k: number]: number }; // 属性列表
		protected $mainAttr: enums.Attr = enums.Attr.STR;
		public get mainAttr() { return this.$mainAttr }


		constructor(battle: Battle, param?: any) {
			this.$battle = battle;
			this.skillLauncher = new SkillLauncher(this);
			this.$view = new view.Unit(this, battle);

			this.init();
		}

		public init() {
			this.skillLauncher.clearSkills();
			this.$attrs = {};
			this.buffs = {};


			this.initData();
			this.$hp = this.attr(enums.Attr.HP);
			this.$mp = this.attr(enums.Attr.MP);
			this.$view.init();
		}

		public abstract initData();

		/** 
		 * attr 属性类型
		 * value 若传参则认为是set操作
		 */
		public attr(attr: enums.Attr, value?: number) {
			if (value != undefined) {
				this.$attrs[attr] = value;
			}
			let func = config.attrFun(attr)
			return this.baseAttr(attr) + (func ? func(this) : 0);
		}

		public baseAttr(attr: enums.Attr) {
			return this.$attrs[attr] || 0;
		}

		public initAttr(attrs: { [k: string]: number }) {
			for (let k in attrs)
				enums.Attr[k] && this.attr(enums.Attr[k], attrs[k]);
		}

		public critical(tar: Unit) {
			// 暴击 / ( 暴击 + 敌方护甲 + 20）
			return this.battle.random() < this.attr(enums.Attr.CRT) / (this.attr(enums.Attr.CRT) + tar.attr(enums.Attr.PRT) + 20);
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
			this.$hp = Math.min(this.$hp, this.attr(enums.Attr.HP));
		}

		public reborn() {
			this.hp = this.attr(enums.Attr.HP);
			this.mp = this.attr(enums.Attr.MP);
			this.skillLauncher.reset();
			this.$view.onBorn();
		}

		public damage(damage: number, source: battle0.Unit) {
			this.hp -= damage;
			if (this.dead) {
				this.die();
			}
		}

		public heal(heal: number) {
			this.hp = Math.min(this.attr(enums.Attr.HP), this.hp + heal);
		}

		protected die() {
			// this.$view.onDie();
			this.$battle.onDie(this);
		}

		public isFriend(ch: Unit) {
			if (this.group == ch.group)
				return true;
			return (this.group == enums.Group.Player && ch.group == enums.Group.Pet)
				|| (this.group == enums.Group.Pet && ch.group == enums.Group.Player);
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