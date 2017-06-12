module dragon.view {
	class MainScene extends Scene {

		private battle: Battle;
		private mainMenu: eui.Component;
		private grp_subpanel: eui.Group;

		private attribute: eui.Component;
		private subpanels: { [k: string]: eui.Component };

		public constructor() {
			super();
		}

		public init() {
			this.skinName = 'resource/skins/scene/Main.exml';

			this.mainMenu = this.replace(this.mainMenu, new panel.MainMenu())
			this.attribute = this.replace(this.attribute, new Attribute())

			this.subpanels = {};
			this.subpanels['battle'] = new Recorder();
			this.subpanels['pack'] = new Package();
			this.showPanel('battle');
		}

		private replace(thisCmp: eui.Component, theone: eui.Component) {
			theone.x != NaN && (theone.x = thisCmp.x);
			theone.y != NaN && (theone.y = thisCmp.y);
			theone.width != NaN && (theone.width = thisCmp.width);
			theone.height != NaN && (theone.height = thisCmp.height);

			theone.top != NaN && (theone.top = thisCmp.top);
			theone.bottom != NaN && (theone.bottom = thisCmp.bottom);
			theone.left != NaN && (theone.left = thisCmp.left);
			theone.right != NaN && (theone.right = thisCmp.right);

			thisCmp.visible = false;
			this.removeChild(thisCmp)
			this.addChild(theone)
			return theone;
		}



		public afterLoaded() {
			if (this.battle instanceof Battle)
				return;
			this.setBattle(dragon.battle.enterMain().view);
		}

		public setBattle(battle: Battle) {
			if (this.battle === battle) {
				return;
			}
			if (this.battle) {
				battle.x = this.battle.x;
				battle.y = this.battle.y;
				battle.width = this.battle.width;
				battle.height = this.battle.height;
				this.removeChild(this.battle);
			}
			this.battle = battle;
			this.addChild(this.battle);
		}

		public showPanel(pnl: string) {
			this.grp_subpanel.removeChildren();
			let subpanel = this.subpanels[pnl];
			if (!subpanel) {
				console.log('无法切换到[%s]界面', pnl);
			}
			subpanel.percentWidth = subpanel.percentHeight = 100;
			this.grp_subpanel.addChild(subpanel);
		}
	}
	export const mainscene = new MainScene();
}