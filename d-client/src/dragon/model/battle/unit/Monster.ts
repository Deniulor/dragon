module dragon.battle0 {
	export class Monster extends Unit {
		public initData() {
			let dmonster = kernel.data.group('monster').rand();
			this.$id = dmonster.id;
			this.$name = dmonster.Name;
			this.$color = '#9840BE';

			for (var i = 0; i < dmonster.Skill.length; ++i) {
				this.skillLauncher.addSkill(new Skill(this, dmonster.Skill[i], dmonster.Level));
			}

			this.attr(enums.Attribute.HP, dmonster.MaxHP);
			this.attr(enums.Attribute.STR, dmonster.STR);
			this.attr(enums.Attribute.DEX, dmonster.Hit);
			this.attr(enums.Attribute.INT, dmonster.Critical);
			this.attr(enums.Attribute.WILL, dmonster.Dodge);

			this.attr(enums.Attribute.DEF, dmonster.DEF);

			this.$view.height = 160;
		}
	}
}