module dragon.manager {
	export const notice = new class {
		private root: eui.UILayer;

		public init() {
			this.root = kernel.ui.noticeLayer;
		}

		public addPrompt(content: string, time: number = 1700) {
		}
	}
}