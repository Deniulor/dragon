module dragon.kernel0 {
	class Pool {
		private pool: { [k: string]: Array<egret.DisplayObject> };
		private create: (name: string) => egret.DisplayObject;

		public constructor(create: (name: string) => egret.DisplayObject) {
			this.pool = {};
			this.create = create;
		}

		public produce(name: string): egret.DisplayObject {
			let unused = this.pool[name] || (this.pool[name] = []);

			if (unused.length > 0) {
				return unused.pop();
			}
			let mc = this.create(name);
			mc.addEventListener(egret.Event.REMOVED, () => {
				this.pool[name].push(mc);
			}, this);
			return mc;
		}
	}

	class ResPool {
		private pools: { [k: string]: Pool } = {};

		private pool(type: string, create: (name: string) => egret.DisplayObject) {
			return this.pools[type] || (this.pools[type] = new Pool(create));
		}

		public font(name: string): egret.BitmapText {
			return <egret.BitmapText>this.pool('font', (name: string) => {
				let mc = new egret.BitmapText();
				mc.font = RES.getRes(name);
				return mc;
			}).produce(name);
		}

		public image(name: string): egret.Bitmap {
			return <egret.Bitmap>this.pool('image', (name: string) => {
				var mc = new egret.Bitmap();
				mc.texture = RES.getRes(name);
				return mc;
			}).produce(name);
		}
	}

	export const res: ResPool = new ResPool();
}