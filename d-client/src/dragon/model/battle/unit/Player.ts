module dragon.battle0 {
	export class Player extends Unit {
		public initData(){
			let dunit = kernel.data.group('unit').rand();
			this.$id = dunit.id;
			this.$name = dunit.Name;
			this.$color = '#FF7100';

			let level = Math.floor(Math.random() * 15) + 1;
			for (var i = 0; i < dunit.Skill.length; ++i) {
				this.skillLauncher.addSkill(new Skill(this, dunit.Skill[i], level));
			}

			let dattr = kernel.data.group('attribute').find(dunit.id * 10000 + level);
			this.attr(enums.Attribute.MaxHP, dattr.MaxHP);
			this.attr(enums.Attribute.STR, dattr.STR);
			this.attr(enums.Attribute.DEF, dattr.DEF);
			this.attr(enums.Attribute.Hit, dattr.Hit);
			this.attr(enums.Attribute.Dodge, dattr.Dodge);
			this.attr(enums.Attribute.Critical, dattr.Critical);
		}
	}
}