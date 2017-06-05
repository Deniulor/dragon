module dragon.battle0 {
	export class Monster extends Unit {
		private dropid: number;
		public initData() {
			let dmonster = kernel.data.group('monster').rand();
			this.$id = dmonster.id;
			this.$name = dmonster.Name;
			this.$color = '#9840BE';

			for (var i = 0; i < dmonster.Skill.length; ++i) {
				this.skillLauncher.addSkill(new Skill(this, dmonster.Skill[i], dmonster.Level));
			}
			this.initAttr(dmonster);
			this.dropid = dmonster.Drop;
		}

		public drop(): model.Reward {
			return manager.drop.drop(this.dropid);
		}
	}
}