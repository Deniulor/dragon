module dragon.battle0 {
	class Record {
		type: string;
		param: any[];
	}

	export class Recorder {
		private records: Array<Record> = [];

		public addRecord(type: string, ...param: any[]): void {
			this.records.push({ type: type, param: param });
			if (this.records.length > kernel.data.factor('BattleRecordLength', 20))
				this.records.shift();

			kernel.event.dispatchEventWith('dragon.battle.record', false, this);
		}

		public parse(): egret.ITextElement[] {
			let rtn = [];
			for (let i = 0; i < this.records.length; ++i) {
				let r = this.records[i]
				rtn = rtn.concat(kernel.data.language('Battle.Record.' + r.type, r.param))
				rtn.push({ text: '\n' });
			}
			return rtn
		}
	}
}