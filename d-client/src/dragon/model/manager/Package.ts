module dragon.manager {
	export const package = new class {
		public items: { [k: number]: model.UniformItem } = {};

		public addItem(item: model.UniformItem) {
			this.addItem0(item);
			kernel.event.dispatchEventWith('dragon.package.changed', false, this);
		}

		private addItem0(item: model.UniformItem) {
			let find = this.items[item.uid];
			let pre = 0;
			if (find) {
				pre = find.count;
				find.count += item.count;
			} else
				this.items[item.uid] = item;

			battle.record('Gain', item.color, item.name)
		}

		public addReward(reward: model.Reward) {
			reward.list.forEach((i) => this.addItem0(i));
			kernel.event.dispatchEventWith('dragon.package.changed', false, this);
		}
	}
}