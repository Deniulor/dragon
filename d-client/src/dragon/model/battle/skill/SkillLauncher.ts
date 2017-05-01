module dragon.battle0 {
	export class SkillLauncher {

		private $skillList: Array<Skill>;
		private creature: battle0.Unit;
		private cd: number;

		public constructor(creature: battle0.Unit) {
			this.creature = creature;
			this.$skillList = [];
			this.cd = kernel.data.factor("ATKCD", 1);
		}

		public addSkill(skill: Skill) {
			this.$skillList.push(skill);
		}

		public update(dt: number) {
			if (this.cd > 0)
				this.cd = Math.max(this.cd - dt, 0);
			for (var k in this.$skillList) {
				this.$skillList[k].update(dt);
			}
		}

		public castSkill(): boolean {
			if (this.cd > 0) {
				return null;
			}
			let skill: Skill = null;
			let select = null;
			for (let i = 0; i < this.$skillList.length; ++i) {
				let s = this.$skillList[i];
				if (!s.enable) {
					continue;
				}
				let select0 = s.select();
				if (!select0 || !select0.selected || select0.caston.length < 0) {
					continue;
				}
				if (skill == null || skill.priority < s.priority) {
					skill = s;
					select = select0;
				}
			}
			return skill && skill.cast(select);
		}

		public resetCD() {
			this.cd = kernel.data.factor("ATKCD", 1);
		}

		public isInCD() {
			return this.cd > 0;
		}

		public clearSkills() {
			this.$skillList = [];
		}
	}
}