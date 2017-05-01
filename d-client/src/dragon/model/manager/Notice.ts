module dragon.model {
	export class NotiveManager {
		private root: eui.UILayer;

		public init(root: eui.UILayer) {
			this.root = root;
		}
		
		public addPrompt(content: string, time: number = 1700) {
		}
	}
}