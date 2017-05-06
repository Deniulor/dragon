module dragon.battle0 {
	export class Bullet {
		private time: number;
		private skill: Skill;
		private selected: Unit;
		private castOn: Array<Unit>;
		private speedx: number;
		private speedy: number;
		private mc: egret.MovieClip;

		public constructor(skill: Skill, selected: Unit, castOn: Array<Unit>) {
			var dx = selected.x - skill.unit.x;
			var dy = selected.y - skill.unit.y;
			this.time = Math.sqrt(dx * dx + dy * dy) / skill.skilldata.BulletSpeed;
			this.speedx = dx / this.time;
			this.speedy = dy / this.time;

			this.skill = skill;
			this.selected = selected;
			this.castOn = castOn;
		}

		public get effect() { return this.skill.bullet }

		public setMovieClip(mc: egret.MovieClip) {
			if (!mc) {
				return;
			}
			var frmx = this.skill.unit.x;
			var frmy = this.skill.unit.y;
			var tox = this.selected.x;
			var toy = this.selected.y;
			this.mc = mc;
			this.mc.x = frmx;
			this.mc.y = frmy;
			this.mc.rotation = Math.atan2(toy - frmy, tox - frmx) / Math.PI * 180 + 90;
		}

		public removeMoveClip() {
			if (this.mc && this.mc.parent) {
				this.mc.parent.removeChild(this.mc);
			}
		}

		/**
		 * @param dt单位：秒
		 */
		public update(dt: number): void {
			this.time -= dt;
			if (this.time <= 0) {
				this.skill.settle(this.selected, this.castOn);
			}
			if (this.mc) {
				this.mc.x += this.speedx * dt;
				this.mc.y += this.speedy * dt;
			}
		}

		public alive(): boolean {
			return this.time > 0;
		}
	}
}