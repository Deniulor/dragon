module dragon.model {
	export class UniformItem {
		private data: any;
		private $uid;
		public get uid(): number { return this.$uid }
		public get quality(): enums.Quality { return this.data.Quality }
		public get color(): string { return utils.tools.getColor(this.quality) }
		public get type(): enums.ItemType { return this.data.Type }
		public get itemId(): number { return this.data.ItemID }
		public get name(): string { return this.data.Name }
		public get icon(): string { return this.data.Icon }


		public count: number;

		constructor(uniformid: number, count: number) {
			this.$uid = uniformid;
			this.data = kernel.data.group('uniformitem').find(uniformid);
			this.count = count;
		}
	}
}