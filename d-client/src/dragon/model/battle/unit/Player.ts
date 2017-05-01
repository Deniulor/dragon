module dragon.battle0 {
	export class Player extends Unit {
		public constructor(battle: Battle) {
			super(battle);

			let dunit = kernel.data.group('unit').rand();
			this.$id = dunit.id;
			this.name = dunit.Name;
			this.$view = new view.Unit(this, battle);

			let level = Math.floor(Math.random() * 30) + 1;
			for (var i = 0; i < dunit.Skill.length; ++i) {
				this.skillLauncher.addSkill(new Skill(this, dunit.Skill[i], level));
			}

			let dattr = kernel.data.group('attribute').find(dunit.id * 10000 + level);
			this.attr(enums.Attribute.MaxHP, dattr.MaxHP);
			this.attr(enums.Attribute.ATK, dattr.ATK);
			this.attr(enums.Attribute.DEF, dattr.DEF);
			this.attr(enums.Attribute.Hit, dattr.Hit);
			this.attr(enums.Attribute.Dodge, dattr.Dodge);
			this.attr(enums.Attribute.Critical, dattr.Critical);

			this.$hp = this.attr(enums.Attribute.MaxHP);
			this.$view.onHpChanged();
		}
	}
}