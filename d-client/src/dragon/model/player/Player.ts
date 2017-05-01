module dragon {
	class PlayerData {
		public id;
		public name;
		public level;
	}

	class Player {
		public data: PlayerData = new PlayerData();
		public team: model.Team;

		public init() {
			this.team = new model.Team();
		}
	}

	/**
	 * @player Player对象
	 */
	export const player: Player = new Player();
}