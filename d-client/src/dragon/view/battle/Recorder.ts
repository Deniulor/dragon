module dragon.view {
	export class Recorder extends eui.Component {
		private lbl_records: eui.Label;

		public constructor() {
			super();
			this.skinName = "resource/skins/battle/Recorder.exml";
			kernel.event.addEventListener('dragon.battle.record', this.onRecords, this);
		}

		public onRecords(event: egret.Event) {
			if (!this.parent) return
			let recorder: battle0.Recorder = event.data;
			this.lbl_records.textFlow = recorder.parse();
		}
	}
}