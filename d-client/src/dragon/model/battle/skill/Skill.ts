module dragon.battle0 {
	export class Skill {

		public cd: number;
		public skilldata: any;
		public skilllv: number;
		public unit: dragon.battle0.Unit;

		private selector: Selector;
		private settler: Settler;

		public constructor() {
		}

		public get enable(): boolean { return true; }

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

		public cast(): boolean {
			var select = this.selector.select(this.unit, this.unit.battle.all);
			if (!select.selected || select.castOn.length <= 0) {
				return false;
			}
			var tar = select.selected;
			this.resetCD();
			// 发射弹道
			var bullet = this.bullet;
			if (!bullet) {
				this.settle(select.selected, select.castOn);//当即结算
			} else {
				this.unit.battle.addBullet(new Bullet(this, select.selected, select.castOn));
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
					vgroup: tar.Group, // 受攻击人阵营
					value: value // 伤害
				});
			}

			this.unit.battle.record({
				time: this.unit.battle['time'] || egret.getTimer().toFixed(),
				attacker: this.unit.id,// 攻击者
				agroup: this.unit.Group, // 攻击者阵营

				skill: this.skilldata.id, // 使用的技能
				settles: settles//结算结果
			});
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