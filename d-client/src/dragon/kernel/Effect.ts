module dragon.kernel0 {
	export interface IEffect {
		once(name: string, parent: egret.DisplayObjectContainer, x?: number, y?: number, callback?: () => void): egret.MovieClip;
		repeat(name: string, parent: egret.DisplayObjectContainer, x?: number, y?: number): egret.MovieClip;
	}

	class EffectPool {
		private name;
		private mcFactory: egret.MovieClipDataFactory;

		private effects: { [k: string]: egret.MovieClip } = {};
		private unused: Array<Effect> = [];

		constructor(name: string) {
			this.name = "effect_" + name;
			var data = RES.getRes('effect_' + name + "_json");
			var txtr = RES.getRes('effect_' + name + "_jpg");
			if (!txtr) {
				txtr = RES.getRes('effect_' + name + "_png");
			}
			if (data && txtr) this.mcFactory = new egret.MovieClipDataFactory(data, txtr);
		}

		public produce(): Effect {
			if (this.unused.length > 0) {
				// if (DEBUG) {
				// 	console.log('effect reused:%s', this.name);
				// }
				return this.unused.pop();
			}
			if (!this.mcFactory) return null;
			var mcdata = this.mcFactory.generateMovieClipData(this.name);
			if (!mcdata) {
				return null;
			}
			var mc = new Effect(mcdata, this);
			return mc;
		}
		public collect(mc: Effect) {
			this.unused.push(mc);
		}
	}

	class Effect extends egret.MovieClip {
		private pool: EffectPool;
		private times: number;
		public callback: () => void;
		constructor(movieClipData: egret.MovieClipData, pool: EffectPool) {
			super(movieClipData);
			this.pool = pool;
			this.blendMode = egret.BlendMode.ADD;
			this.addEventListener(egret.Event.COMPLETE, this.removeFromParent, this);
			this.addEventListener(egret.Event.REMOVED, this.collect, this);
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		}

		public gotoAndPlay(name: string, times: number) {
			this.times = times;
			super.gotoAndPlay(name, times);
		}

		private removeFromParent() {
			if (this.parent) {
				this.parent.removeChild(this);
			}
			if (this.callback) {
				this.callback();
				this.callback = null;
			}
		}

		private collect() {
			this.pool.collect(this);
		}

		private onAddToStage() {
			if (this.times) {
				this.play(this.times);
			}
		}
	}


	export class EffectManager implements IEffect {

		private effectpool: { [k: string]: EffectPool } = {};

		private getPool(name: string): EffectPool {
			var pool = this.effectpool[name];
			if (!pool) {
				pool = this.effectpool[name] = new EffectPool(name);
			}
			return pool;
		}

		public once(name: string, parent: egret.DisplayObjectContainer, x: number = 0, y: number = 0, callback?: () => void): egret.MovieClip {
			var pool = this.getPool(name);
			var mc = pool.produce();
			if (!mc) {
				if (callback) callback();
				console.error('[kernel.effect] once 缺少特效:%s', name);
				return;
			}
			if (parent.numChildren > kernel.data.factor('EffectMax', 3)) {
				parent.removeChildAt(0);
			}
			parent.addChild(mc);
			mc.x = x;
			mc.y = y;
			mc.gotoAndPlay('effect', 1);
			mc.callback = callback;
			return mc;
		}

		public repeat(name: string, parent: egret.DisplayObjectContainer, x: number = 0, y: number = 0): egret.MovieClip {
			var pool = this.getPool(name);
			var mc = pool.produce();
			if (!mc) {
				console.error('[kernel.effect] repeat 缺少特效:%s', name);
				return null;
			}
			if (parent.numChildren > kernel.data.factor('EffectMax', 3)) {
				parent.removeChildAt(0);
			}
			parent.addChild(mc);
			mc.x = x;
			mc.y = y;
			mc.gotoAndPlay('effect', -1);
			mc.callback = null;
			return mc;
		}
	}
}