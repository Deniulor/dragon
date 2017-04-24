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

		public nextSkill(): Skill {
			if (this.cd > 0) {
				return null;
			}
			var skill: Skill = null;
			for (var i = 0; i < this.$skillList.length; ++i) {
				var s = this.$skillList[i];
				if (!s.enable) {
					continue;
				}
				if (skill == null || skill.priority < s.priority) {
					skill = s;
				}
			}
			return skill;
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