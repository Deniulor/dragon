module dragon.manager {
	export const package = new class {

		public items: { [k: number]: model.UniformItem }

		private store_key = 'Dragon_Pack';
		public init() {
			this.items = {};

			let load: Array<{ uniformid: number, count: number }> = JSON.parse(kernel.storage.get(this.store_key))
			if (!load)
				return

			load.forEach(i => this.addItem00(new model.UniformItem(i.uniformid, i.count)));
			this.onchanged()
		}

		public addItem(item: model.UniformItem) {
			this.addItem0(item);
			this.onchanged();
		}

		private addItem0(item: model.UniformItem) {
			this.addItem00(item);
			battle.record('Gain', item.color, item.name)
		}

		private addItem00(item: model.UniformItem) {
			let find = this.items[item.uid];
			let pre = 0;
			if (find) {
				pre = find.count;
				find.count += item.count;
			} else
				this.items[item.uid] = item;
		}

		public addReward(reward: model.Reward) {
			reward.list.forEach((i) => this.addItem0(i));
			this.onchanged();
		}

		private onchanged() {
			let tosave = [];
			for (let k in this.items) {
				let item = this.items[k];
				tosave.push({ uniformid: item.uid, count: item.count });
			}
			kernel.storage.set(this.store_key, JSON.stringify(tosave));

			// 通知界面层
			kernel.event.dispatchEventWith('dragon.package.changed', false, this);
		}
	}
}