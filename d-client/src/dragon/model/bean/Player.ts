module dragon {
	class PlayerData {
		public id;
		public name;
		public level;
	}

	class Player {
		public data: PlayerData = new PlayerData();

		public init() {
		}
	}

	/**
	 * @player Player对象
	 */
	export const player: Player = new Player();
}