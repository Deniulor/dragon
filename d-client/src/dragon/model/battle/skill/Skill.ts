module dragon.battle0 {
	export class Skill {

		public cd: number;
		public skilldata: any;
		public skilllv: number;
		public unit: dragon.battle0.Unit;

		private selector: Selector;
		private settler: Settler;

		public constructor(unit: Unit, skillid: any, skilllv: number) {
			this.unit = unit;
			this.skilllv = skilllv;

			let skilldata = kernel.data.group('skill').find(skillid);
			this.skilldata = skilldata;

			this.selector = new Selector(skilldata.SelectTarget, skilldata.SelectStrategy, skilldata.CastTarget, skilldata.SelectType);
			this.settler = SettlerFactory.create(skilldata.SettleType, this);
			this.cd = 0;
		}

		public get enable(): boolean {
			return this.cd <= 0;
		}

		public get priority(): number {
			return this.skilldata.Priority;
		}
		public get bullet(): string {
			return this.skilldata.Bullet;
		}
		public get bulletSpeed(): number {
			return this.skilldata.BulletSpeed;
		}
		public get settleEffect(): string {
			return this.skilldata.SettleEffect;
		}
		public get strength(): number {
			return (this.skilldata.Attr + this.skilldata.AttrAdd * this.skilllv) / 100;
		}

		public select() {
			return this.selector.select(this.unit, this.unit.battle.all);
		}
		public cast(select: { selected: Unit, caston: Array<Unit> }): boolean {
			if (!select.selected || select.caston.length <= 0) {
				return false;
			}
			this.resetCD();
			// 发射弹幕
			var bullet = this.bullet;
			if (!bullet) {
				this.settle(select.selected, select.caston);//当即结算
			} else {
				this.unit.battle.addBullet(new Bullet(this, select.selected, select.caston));
			}
			// console.log("[cast] time:%s, group:%s, caster:%s, loc:(%s, %s), skill:%s, seed:%s", //
			// 	this.creature.battle['time'], this.creature.Group, this.creature.id, this.creature.x, this.creature.y, this.skilldata.id, this.creature.battle["seed"]);
			return true;
		}

		// 技能结算
		public settle(target: Unit, caston: Array<Unit>) {
			if (this.unit.hp < 0) {
				return;
			}
			// 播放特效
			this.settleEffect && target.view.play(this.settleEffect);

			var settles = [];
			// 每个单位进行结算
			for (var i = 0; i < caston.length; ++i) {
				var tar = caston[i];
				if (tar.dead) {
					continue;
				}
				var value = this.settler.settle(this.unit, tar);
				settles.push({
					victim: tar.id, // 受攻击人
					vgroup: tar.group, // 受攻击人阵营
					value: value // 伤害
				});
			}
		}

		public update(dt: number) {
			if (this.cd > 0)
				this.cd = Math.max(this.cd - dt, 0);
		}

		public resetCD() {
			this.cd = this.skilldata.CD / 1000.0;
		}
	}
}