module dragon.kernel0 {
	export interface ILocalStorage {
		get(item: string): string;
		set(item: string, value: string);
		remove(item: string);
	}

	export class LocalStorage implements ILocalStorage {
		public get(item: string): string {
			return egret.localStorage.getItem(item);
		}
		public set(item: string, value: string) {
			return egret.localStorage.setItem(item, value);
		}
		public remove(item: string) {
			return egret.localStorage.removeItem(item);
		}
	}
}