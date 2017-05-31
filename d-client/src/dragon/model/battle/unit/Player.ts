module dragon.battle0 {
	export class Player extends Unit {
		public initData() {
			let dunit = kernel.data.group('unit').rand();
			this.$id = dunit.id;
			this.$name = dunit.Name;
			this.$color = '#FF7100';

			let level = Math.floor(Math.random() * 15) + 1;
			for (var i = 0; i < dunit.Skill.length; ++i) {
				this.skillLauncher.addSkill(new Skill(this, dunit.Skill[i], level));
			}

			let dattr = kernel.data.group('attribute').find(dunit.id * 10000 + level);
			this.attr(enums.Attribute.HP, dattr.MaxHP);
			this.attr(enums.Attribute.STR, dattr.STR);
			this.attr(enums.Attribute.DEX, dattr.Hit);
			this.attr(enums.Attribute.INT, dattr.Critical);
			this.attr(enums.Attribute.WILL, dattr.Dodge);
			this.attr(enums.Attribute.DEF, dattr.DEF);

			kernel.event.dispatchEventWith('dragon.battle.attribute', false, this);
		}
	}
}