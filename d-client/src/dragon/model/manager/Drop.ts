module dragon.manager {
	export const drop = new class {
		public drop(dropid: number): model.Reward {
			let d = kernel.data.group('drop').find(dropid);
			if (!d) {
				console.error('掉落组不存在:', dropid)
				return
			}
			let rwd = new model.Reward();
			if (d.RegularItemId.length != d.RegularCount.length)
				console.error('[drop]表id为%s的掉落组 RegularItemId字段和RegularCount字段长度不一致', dropid);
			for (let i = 0; i < d.RegularItemId.length; ++i)
				rwd.addUniform(d.RegularItemId[i], d.RegularCount[i]);

			//ChanceItemId	ChanceCount	Chance
			if (d.ChanceItemId.length != d.ChanceCount.length || d.ChanceItemId.length != d.Chance.length)
				console.error('[drop]表id为%s的掉落组 ChanceItemId,ChanceCount,Chance 字段长度不一致', dropid);
			for (let i = 0; i < d.ChanceItemId.length; ++i)
				if (Math.random() < d.Chance[i] / 1000)
					rwd.addUniform(d.ChanceItemId[i], d.ChanceCount[i]);

			// 	WeightItemId	WeightCount	Weight
			if (d.WeightItemId.length != d.WeightCount.length || d.WeightItemId.length != d.Weight.length)
				console.error('[drop]表id为%s的掉落组 WeightItemId,WeightCount,Weight 字段长度不一致', dropid);

			let weightsum = 0;
			for (let i = 0; i < d.Weight.length; ++i)
				weightsum += d.Weight[i];
			let w = Math.random() * weightsum;
			for (let i = 0; i < d.Weight.length; ++i) {
				w -= d.Weight[i];
				if (w < 0)
					rwd.addUniform(d.WeightItemId[i], d.WeightCount[i]);
			}
			return rwd;
		}
	}
}