module dragon.view.component {
	export class Item extends eui.ItemRenderer {
		protected lbl_name: eui.Label;
		protected img_icon: eui.Image;

		protected dataChanged(): void {
			let data = <model.UniformItem>this.data;
			if (!data)
				return

			this.lbl_name.text = data.name
			this.lbl_name.textColor = parseInt(data.color.replace('#', ''), 16);
			this.img_icon.source = data.icon;
		}
	}
}