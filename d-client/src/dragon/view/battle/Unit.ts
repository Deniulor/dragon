module dragon.view {
	export class Unit extends eui.Component {

		private unit: dragon.battle0.Unit;
		private battle: dragon.view.Battle;

		private effects: egret.DisplayObjectContainer;
		private buffLayer: egret.DisplayObjectContainer;

		private rct_hp: eui.Rect;
		private lbl_hp: eui.Label;
		private rct_mp: eui.Rect;
		private lbl_mp: eui.Label;
		private lbl_name: eui.Label;

		private $pos: egret.Point;
		public get pos(): egret.Point {
			if (!this.$pos) {
				let p = new egret.Point(this.x + this.width / 2, this.y + this.height / 2);
				let parent = this.parent;
				while (parent && parent != this.battle) {
					p.x += parent.x;
					p.y += parent.y;
					parent = parent.parent;
				}
				this.$pos = parent == this.battle ? p : null;
			}
			return this.$pos;
		}

		public constructor(unit: dragon.battle0.Unit, battle: dragon.battle0.Battle) {
			super();
			this.unit = unit;
			this.battle = battle.view;

			this.skinName = "resource/skins/battle/Unit.exml";

			this.buffLayer = new egret.DisplayObjectContainer();
			this.buffLayer.x = this.width / 2;
			this.buffLayer.y = this.height;
			this.addChild(this.buffLayer);

			this.effects = new egret.DisplayObjectContainer();
			this.addChild(this.effects);
		}

		public init() {
			this.visible = true;
			this.lbl_name.text = this.unit.name;
			this.onHpChanged();
			this.onMpChanged();
		}

		public play(skill: string) {
			kernel.effect.once(skill, this.battle.effectLayer, this.pos.x, this.pos.y + 75 /*龙女素材偏移了*/); // 播放特效
		}

		public addBuff(buff: battle0.Buff) {
			if (!buff.effect || (buff.mc && buff.mc.parent))
				return;
			buff.mc = kernel.effect.repeat(buff.effect, this.buffLayer);
		}

		public removeBuff(buff: battle0.Buff) {
			if (!buff.effect || !buff.mc || !buff.mc.parent)
				return;
			buff.mc.parent.removeChild(buff.mc);
		}

		public onHpChanged() {
			this.lbl_hp.text = Math.max(Math.floor(this.unit.hp), 0) + "/" + Math.floor(this.unit.attr(enums.Attr.HP))
			egret.Tween.get(this.rct_hp).to({ scaleX: Math.max(this.unit.hp / this.unit.attr(enums.Attr.HP), 0) }, 400, egret.Ease.circInOut)
		}

		public onMpChanged() {
			this.lbl_mp.text = Math.max(Math.floor(this.unit.mp), 0) + "/" + Math.floor(this.unit.attr(enums.Attr.MP))
			egret.Tween.get(this.rct_mp).to({ scaleX: Math.max(this.unit.mp / this.unit.attr(enums.Attr.MP), 0) }, 400, egret.Ease.circInOut)
		}

		public onDie() {
			this.play('death');
			this.visible = false;
			this.$pos = null;
		}

		public onBorn() {
			this.effects.removeChildren();
			this.visible = true;
		}

		public onDamage(source: battle0.Unit, damage: number, isCritical: boolean = false) {
			damage = Math.floor(damage);
			//TODO: 掉血弹字特效
			var frm = source.view.pos;
			var to = this.pos;
			var angle = Math.atan2(to.y - frm.y, to.x - frm.x);
			var hpEffect;// new egret.BitmapText();
			if (isCritical && damage > 0) {
				hpEffect = kernel0.res.font('bj_number_fnt');
				hpEffect.text = 'B-' + damage;
			} else {
				hpEffect = kernel0.res.font('battle_number_fnt');
				hpEffect.text = '-' + damage;
				if (damage <= 0) {
					hpEffect.text = 'M';
				}
			}
			hpEffect.x = this.x - hpEffect.width / 2;
			hpEffect.y = this.y - this.height / 2 - 40;
			hpEffect.scaleX = .8;
			hpEffect.scaleY = .8;
			this.battle.addEffect(hpEffect);
			var angle = this.getHpAngel(source);
			egret.Tween.get(hpEffect)
				.to({ x: (hpEffect.x + Math.sin(angle) * 150), y: hpEffect.y - Math.cos(angle) * 30, scaleX: 1.2, scaleY: 1.2 }, 200)
				.to({ y: hpEffect.y - Math.cos(angle) * 30 - 20, alpha: 0.5 }, 300)
				.call(this.removeFromParent, this, [hpEffect]);
		}

		protected getHpAngel(source: battle0.Unit) {
			return 0;
		}

		private removeFromParent(obj: egret.DisplayObject) {
			if (obj && obj.parent) {
				obj.alpha = 1;
				obj.scaleX = 1;
				obj.scaleY = 1;
				obj.parent.removeChild(obj);
			}
		}

		public onHeal(heal: number) {
			heal = Math.floor(heal);
			var hpEffect = kernel0.res.font('treat_fnt');//new egret.BitmapText();
			hpEffect.text = 'H+' + heal;
			hpEffect.x = this.x - hpEffect.width / 2;
			hpEffect.y = this.y - this.height / 2 - 40;
			hpEffect.scaleX = .8;
			hpEffect.scaleY = .8;
			this.battle.addEffect(hpEffect);
			egret.Tween.get(hpEffect)
				.to({ y: hpEffect.y - 250, scaleX: 1.0, scaleY: 1.0 }, 2000)
				.call(this.removeFromParent, this, [hpEffect]);
		}
	}
}