module dragon.model {
	export class EquipSave {
		sid: number;
		uniformid: number;
		baseAttr: { [k: number]: number };
		extraAttr: { attr: number, value: number }[];
	}
	export class Equip {
		private $sid: number;
		private $duniform: any;
		private $dequip: any;
		public get sid(): number { return this.$sid }
		public get uniformid(): number { return this.$duniform.id }
		public get equipId(): number { return this.$duniform.ItemID }
		public get quality(): enums.Quality { return this.$duniform.Quality }
		public get color(): string { return utils.tools.getColor(this.quality) }
		public get type(): enums.ItemType { return this.$duniform.Type }
		public get name(): string { return this.$duniform.Name }
		public get icon(): string { return this.$duniform.Icon }

		private $baseAttr: { [k: number]: number };
		private $extraAttr: Array<{ attr: number, value: number }>;
		constructor(item: UniformItem, sid?: number, baseAttr?: { [k: number]: number }, extraAttr?: Array<{ attr: number, value: number }>) {
			if (item.type != enums.ItemType.Equip) {
				console.error('物品%s不是装备', item.uniformid);
			}
			this.$duniform = item.data;
			let d = this.$dequip = kernel.data.group('equip').find(item.itemId);

			if (sid && baseAttr && extraAttr) {
				this.$sid = sid;
				this.$baseAttr = baseAttr;
				this.$extraAttr = extraAttr;
			} else {
				this.$sid = Math.floor(new Date().getTime() % 1e7 * 1000 + Math.random() * 1000);
				this.$baseAttr = {};
				//BaseAttrType	BaseAttrValueMin	BaseAttrValueMax
				if (d.BaseAttrType.length != d.BaseAttrValueMin.length || d.BaseAttrType.length != d.BaseAttrValueMax.length)
					console.error('[equip]表id为%s的装备 BaseAttrType,BaseAttrValueMin,BaseAttrValueMax 字段长度不一致', item.itemId);
				for (let i = 0; i < d.BaseAttrType.length; ++i)
					this.$baseAttr[d.BaseAttrType[i]] = d.BaseAttrValueMin[i] + Math.random() * (d.BaseAttrValueMax[i] - d.BaseAttrValueMin[i]);

				this.$extraAttr = [];
				//ExtraAttrType	ExtraAttrValueMin	ExtraAttrValueMax
				if (d.ExtraAttrType.length != d.ExtraAttrValueMin.length || d.ExtraAttrType.length != d.ExtraAttrValueMax.length)
					console.error('[equip]表id为%s的装备 ExtraAttrType, ExtraAttrValueMin, ExtraAttrValueMax 字段长度不一致', item.itemId);
				for (let cnt = 0; cnt < d.ExtrAttrNum; ++cnt) {
					let i = Math.floor(Math.random() * d.ExtraAttrType.length)
					this.$extraAttr.push({
						attr: d.ExtraAttrType[i],
						value: d.ExtraAttrValueMin[i] + Math.random() * (d.ExtraAttrValueMax[i] - d.ExtraAttrValueMin[i])
					});
				}
			}
		}

		public get savedata(): EquipSave {
			return { sid: this.sid, uniformid: this.uniformid, baseAttr: this.$baseAttr, extraAttr: this.$extraAttr }
		}
	}
}