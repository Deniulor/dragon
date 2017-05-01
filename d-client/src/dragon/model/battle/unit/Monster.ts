module dragon.battle0 {
	export class Monster extends Unit {
		public constructor(battle: Battle) {
			super(battle);

			let dmonster = kernel.data.group('monster').rand();
			this.$id = dmonster.id;
			this.name = dmonster.Name;
			this.$view = new view.Unit(this, battle);
			this.$view.height /= 3;

			for (var i = 0; i < dmonster.Skill.length; ++i) {
				this.skillLauncher.addSkill(new Skill(this, dmonster.Skill[i], dmonster.Level));
			}

			this.attr(enums.Attribute.MaxHP, dmonster.MaxHP);
			this.attr(enums.Attribute.ATK, dmonster.ATK);
			this.attr(enums.Attribute.DEF, dmonster.DEF);
			this.attr(enums.Attribute.Hit, dmonster.Hit);
			this.attr(enums.Attribute.Dodge, dmonster.Dodge);
			this.attr(enums.Attribute.Critical, dmonster.Critical);

			this.$hp = this.attr(enums.Attribute.MaxHP);
			this.$view.onHpChanged();
		}
	}
}