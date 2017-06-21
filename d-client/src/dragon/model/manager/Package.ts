module dragon.manager {
	export const package = new class {

		public items: { [k: number]: model.UniformItem }
		public equips: { [k: number]: model.Equip }

		private items_key = 'Dragon_Items';
		private equips_key = 'Dragon_Equips';
		public init() {
			this.items = {};
			this.equips = {};

			let loaditem: Array<{ uniformid: number, count: number }> = JSON.parse(kernel.storage.get(this.items_key))
			if (loaditem)
				loaditem.forEach(i => this.addItem00(new model.UniformItem(i.uniformid, i.count)));

			let loadEquip: Array<model.EquipSave> = JSON.parse(kernel.storage.get(this.equips_key))
			if (loadEquip)
				loadEquip.forEach(equip => {
					let item = new model.UniformItem(equip.uniformid, 1)
					this.equips[equip.sid] = new model.Equip(item, equip.sid, equip.baseAttr, equip.extraAttr)
				})

			// 通知界面层
			kernel.event.dispatchEventWith('dragon.package.changed', false, this);
		}

		public addItem(itemid: number, count: number);
		public addItem(item: model.UniformItem);

		public addItem(idOrIns: any, count?: number) {
			if (count != undefined) {
				this.addItem0(new model.UniformItem(idOrIns, count));
			} else {
				this.addItem0(idOrIns);
			}
			this.onchanged();
		}

		private addItem0(item: model.UniformItem) {
			if (item.type == enums.ItemType.Equip) {
				let equip = new model.Equip(item);
				this.equips[equip.sid] = equip;
				battle.record('Equip', item.color, item.name)
			} else {
				this.addItem00(item);
				battle.record('Gain', item.color, item.name, item.count)
			}
		}

		private addItem00(item: model.UniformItem) {
			let find = this.items[item.uniformid];
			let pre = 0;
			if (find) {
				pre = find.count;
				find.count += item.count;
			} else
				this.items[item.uniformid] = item;
		}

		public addReward(reward: model.Reward) {
			reward.list.forEach((i) => this.addItem0(i));
			this.onchanged();
		}

		private onchanged() {
			let tosaveitems = [];
			for (let k in this.items) {
				let item = this.items[k];
				tosaveitems.push({ uniformid: item.uniformid, count: item.count });
			}
			kernel.storage.set(this.items_key, JSON.stringify(tosaveitems));

			let tosaveequips = [];
			for (let k in this.equips) {
				tosaveequips.push(this.equips[k].savedata);
			}
			kernel.storage.set(this.equips_key , JSON.stringify(tosaveequips));

			// 通知界面层
			kernel.event.dispatchEventWith('dragon.package.changed', false, this);
		}
	}
}