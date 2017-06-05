module dragon.model {
	export class Reward {
		public list: Array<UniformItem> = [];

		public addUniform(uniformid: number, count: number): UniformItem {
			let item = new UniformItem(uniformid, count);
			this.list.push(item);
			return item;
		}
	}
}