module dragon.view {
	export class Package extends eui.Component {

		private lst_item: eui.List;

		public constructor() {
			super();
			this.skinName = "resource/skins/panel/subpanel/Package.exml";
			this.lst_item.dataProvider = new eui.ArrayCollection([]);
			this.lst_item.itemRenderer = view.component.Item;

			kernel.event.addEventListener('dragon.package.changed', this.onPackageChanged, this);
		}

		public onPackageChanged(event: egret.Event) {
			let arr = [];
			for (let k in dragon.manager.package.items) {
				let item = dragon.manager.package.items[k];
				arr.push(dragon.manager.package.items[k]);
			}
			this.lst_item.dataProvider = new eui.ArrayCollection(arr);
		}
	}
}