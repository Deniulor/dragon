module dragon.battle0 {
    export class SettlerFactory {
        public static create(SettleType: string, param: Skill): Settler {
            var type = settlers[SettleType];
            if (!type) {
                console.error('技能结算类型%s不存在', SettleType);
            }
            return new type(param);
        }
    }

    export abstract class Settler {
        protected skill: Skill;
        public constructor(skill: Skill) {
            this.skill = skill;
        }
        public abstract settle(me: Unit, tar: Unit);
    }

    namespace settlers {
        export class Damage extends Settler {
            public constructor(skill: Skill) {
                super(skill);
            }
            public settle(me: Unit, tar: Unit) {
                // var dmg = (me.attr(enums.Attribute.STR) - (tar.attr(enums.Attribute.DEF) || 0)) * this.skill.strength;

                let dmg = (me.attr(enums.Attr.ATK_MAX) - me.attr(enums.Attr.ATK_MIN))
                    * (Math.random() * (1 - me.attr(enums.Attr.BAL) / 150))
                    + me.attr(enums.Attr.ATK_MIN);
                let isCritical = me.critical(tar);
                if (isCritical)
                    dmg *= me.attr(enums.Attr.CRT_M);
                dmg = Math.floor(dmg);
                tar.damage(dmg, me);
                tar.view.onDamage(me, dmg, isCritical);
                battle.record("Damage", me.name, me.color, this.skill.skilldata.Name, tar.name, tar.color, isCritical ? dmg + '!' : dmg);
                return dmg;
            }
        }

        export class Heal extends Settler {
            public constructor(skill: Skill) {
                super(skill);
            }
            public settle(me: Unit, tar: Unit) {
                var heal = me.attr(enums.Attr.STR) * this.skill.strength;
                heal = Math.floor(heal);
                tar.heal(heal);
                tar.view.onHeal(heal);
                return heal;
            }
        }

        export class Buff extends Settler {
            public constructor(skill: Skill) {
                super(skill);
            }
            public settle(me: Unit, tar: Unit) {
                // 清除buff
                if (this.skill.skilldata.ClearBuffList) {
                    tar.removeBuff(this.skill.skilldata.ClearBuffList);
                }
                // 添加buff
                if (this.skill.skilldata.Buff) {
                    tar.addBuff(new battle0.Buff(tar, this.skill.skilldata.Buff, this.skill.skilllv));
                }
                return 0;
            }
        }
    }
}