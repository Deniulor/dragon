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
			this.initAttr(dattr);

			kernel.event.dispatchEventWith('dragon.battle.attribute', false, this);
		}
	}
}