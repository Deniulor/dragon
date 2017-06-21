module dragon.model {
	export class UniformItem {
		private $data: any;
		private $uniformid;
		public get data() { return this.$data }
		public get uniformid(): number { return this.$uniformid }
		public get quality(): enums.Quality { return this.$data.Quality }
		public get color(): string { return utils.tools.getColor(this.quality) }
		public get type(): enums.ItemType { return this.$data.Type }
		public get itemId(): number { return this.$data.ItemID }
		public get name(): string { return this.$data.Name }
		public get icon(): string { return this.$data.Icon }
		public get showInPack(): boolean { return this.$data.ShowInPack }

		public count: number;

		constructor(uniformid: number, count: number) {
			this.$uniformid = uniformid;
			this.$data = kernel.data.group('uniformitem').find(uniformid);
			this.count = count;
		}
	}
}