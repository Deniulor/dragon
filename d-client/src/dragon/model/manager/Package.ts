module dragon.manager {
	export const package = new class {
		public map: { [k: number]: model.UniformItem } = {};

		public addItem(item: model.UniformItem) {
			let find = this.map[item.uid];
			let pre = 0;
			if (find) {
				pre = find.count;
				find.count += item.count;
			} else
				this.map[item.uid] = item;

			battle.record('Gain', item.color, item.name)
		}
		public addReward(reward: model.Reward) {
			reward.list.forEach((i) => this.addItem(i));
		}
	}
}