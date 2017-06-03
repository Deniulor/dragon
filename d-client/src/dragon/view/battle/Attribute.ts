module dragon.view {
	export class Attribute extends eui.Component {
		private lbl_STR: eui.Label; //	力量：选择近战武器时增加基础攻击
		private lbl_DEX: eui.Label; //	敏捷：选择远程武器时增加基础攻击，并决定出手先后
		private lbl_INT: eui.Label; //	智力：增加魔法伤害和技能释放率
		private lbl_WILL: eui.Label; // 意志：增加暴击率和暴击伤害
		private lbl_LUCK: eui.Label; // 幸运：增加暴击率和掉宝率


		private lbl_ATK: eui.Label; //	攻击：同时增加最小攻击和最大攻击
		private lbl_BAL: eui.Label; //	平衡：影响伤害的波动
		private lbl_CRT: eui.Label; //	暴击：影响暴击的概率
		private lbl_CRT_M: eui.Label; //	暴击倍数：影响暴击打出的伤害

		private lbl_DEF: eui.Label; //	防御：百分比降低伤害
		private lbl_PRT: eui.Label; //	护甲：直接降低伤害
		private lbl_PRT_I: eui.Label; // 无视护甲：无视对方直接降低伤害
		public constructor() {
			super();
			this.skinName = "resource/skins/battle/Attribute.exml";
			kernel.event.addEventListener('dragon.battle.attribute', this.onAttribute, this);
		}

		public onAttribute(event: egret.Event) {
			if (!this.parent) return
			let player: battle0.Player = event.data;
			this.lbl_STR.text = player.attr(enums.Attr.STR).toFixed()
			this.lbl_DEX.text = player.attr(enums.Attr.DEX).toFixed()
			this.lbl_INT.text = player.attr(enums.Attr.INT).toFixed()
			this.lbl_WILL.text = player.attr(enums.Attr.WILL).toFixed()
			this.lbl_LUCK.text = player.attr(enums.Attr.LUCK).toFixed()

			this.lbl_ATK.text = player.attr(enums.Attr.ATK_MIN).toFixed() + '~' + player.attr(enums.Attr.ATK_MAX).toFixed()
			this.lbl_BAL.text = player.attr(enums.Attr.BAL).toFixed()
			this.lbl_CRT.text = player.attr(enums.Attr.CRT).toFixed()
			this.lbl_CRT_M.text = player.attr(enums.Attr.CRT_M).toFixed()

			this.lbl_DEF.text = player.attr(enums.Attr.DEF).toFixed()
			this.lbl_PRT.text = player.attr(enums.Attr.PRT).toFixed()
			this.lbl_PRT_I.text = player.attr(enums.Attr.PRT_I).toFixed()
		}
	}
}