module dragon.view {
	export class Unit extends eui.Component {

		private unit: dragon.battle0.Unit;
		private battle: dragon.view.Battle;


		private effects: egret.DisplayObjectContainer;
		private modelLayer: egret.DisplayObjectContainer;
		private buffLayer: egret.DisplayObjectContainer;

		public constructor(unit: dragon.battle0.Unit, battle: dragon.battle0.Battle) {
			super();
			this.unit = unit;
			this.battle = battle.view;

		}

		public play(skill: string) {
			if (!this.battle.effectLayer) {
				return;
			}
			kernel.effect.once(skill, this.battle.effectLayer, this.x, this.y); // 被击特效
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


		public onDie() {
			this.play('death');
			this.visible = false;
		}

		public onReborn() {
			this.effects.removeChildren();
			this.visible = true;
		}

		public onDamage(source: battle0.Unit, damage: number, isCritical: boolean = false) {
			damage = Math.floor(damage);
			//TODO: 掉血弹字特效
			var angle = Math.atan2(this.y - source.y, this.x - source.x);
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