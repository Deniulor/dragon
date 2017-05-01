module dragon.enums {
	export enum Attribute {
		None, // 无
		MaxHP, // 最大生命值
		ATK, // 攻击
		DEF, // 防御
		RGS, // 魔防
		Hit, // 命中
		Dodge, // 闪避
		Critical, // 暴击
		Tenacity, // 暴抗
		RNG, // 攻击距离
		SPD,// 移动速度

		//特殊属性，战斗计算时使用
		Damage, // 伤害加成
		Reduction, // 减伤
		HitPro, //命中概率
		DodgePro, //闪避概率
		CriticalPro, //暴击概率
		TenacityPro, //暴抗概率
	}
}