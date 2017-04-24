module dragon {
	class PlayerData {
		public $name: string;
		public pid: number;
		public icon: number;
		public createTime: number;
		public vipLv: number;
		public vipExp: number;
		public lv: number;
		public exp: number;
		public dungeonlv: number;
		public gold: number;
		public crystal: number;
		public strengthenMaterial: number;
		public gemMaterial: number;
		public starMaterial: number;
		public merMaterial: number;
		public wingMaterial: number;
		public arenaToken: number;
		public equipInstanceMaterial: number;
		public gemInstanceMaterial: number;
		public meridianInstanceMaterial: number;
		public artificeMaterial: number;
		public redPiece: number;
		public extPackage: number;
		public buyPackageTimes: number;
		public warspiritTalentMaterial: number;
		public warspiritLv: number;
		public warspiritExp: number;
		public warspiritTalent: number;
		public lottery: number;
		public dressMaterial: number;

		public set name(name: string) {
			this.$name = name;
		}
		public get name() {
			return this.$name;
		}
	}

	class Player {
		public data: PlayerData = new PlayerData();
		public vipGift: Array<boolean> = [];

		public init() {
		}
	}

	/**
	 * @player Player对象
	 */
	export const player: Player = new Player();
}