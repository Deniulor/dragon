module dragon.battle0 {
	class Config {
		public CriticalMultiple: number = 1.2;


		private attrFuncs: { [k: number]: Function };
		public attrFun(attr: enums.Attribute) {
			if (!this.attrFuncs) {
				let all = kernel.data.group('attrdefine').all();
				
			}
			return this.attrFuncs[attr];
		}

		private defaultAttrFunc(u: Unit, attr: enums.Attribute) {
			return u.baseAttr(attr);
		}
	}

	export const config = new Config();
}