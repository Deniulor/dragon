module dragon.battle0 {
	class Config {
		public CriticalMultiple: number = 1.2;


		private attrFuncs: { [k: number]: (u: Unit) => number };
		public attrFun(attr: enums.Attr) {
			if (!this.attrFuncs) {
				this.attrFuncs = {}
				let all = kernel.data.group('attrdefine').all();
				for (let k in all) {
					let a: enums.Attr = enums.Attr[k];
					if (!a) {
						console.error('attrdefine 表有错误的key:', a);
						continue
					}
					this.attrFuncs[a] = this.genAttrDefine(all[k].define);
				}
			}
			return this.attrFuncs[attr]
		}

		private genAttrDefine(def: string): (u: Unit) => number {
			let splits = def.split(/\s+/g);
			let funcs = new Array(splits.length);
			// 转化为函数
			for (let i = 0; i < splits.length; ++i) {
				let s = splits[i];
				if (parseFloat(s).toString() != "NaN") // 是数字，返回转化函数
					funcs[i] = function (u: Unit) {
						return Number(s)
					}
				else if (enums.Attr[s])
					funcs[i] = function (u: Unit) {
						return u.baseAttr(enums.Attr[s])
					}
				else if (s.toLowerCase() == 'main') {
					funcs[i] = function (u: Unit) {
						return u.baseAttr(u.mainAttr)
					}
				} else {
					funcs[i] = s
				}
			}
			//四则运算中的 乘除
			let length = funcs.length;
			for (let i = 1; i < length; ++i) {
				if (funcs[i] == '*') {
					funcs.splice(i - 1, 3, this.genFunc(funcs[i - 1], funcs[i + 1], '*'))
				} else if (funcs[i] == '/') {
					funcs.splice(i - 1, 3, this.genFunc(funcs[i - 1], funcs[i + 1], '/'))
				}
				length = funcs.length
			}
			//四则运算中的 加减
			for (let i = 1; i < length; ++i) {
				if (funcs[i] == '+') {
					funcs.splice(i - 1, 3, this.genFunc(funcs[i - 1], funcs[i + 1], '+'))
				} else if (funcs[i] == '-') {
					funcs.splice(i - 1, 3, this.genFunc(funcs[i - 1], funcs[i + 1], '-'))
				}
				length = funcs.length
			}

			if (funcs.length != 1) {
				console.error('attrdefine 中def无法转化为公式:', def);
			}
			return funcs[0]
		}

		private genFunc(left: (u: Unit) => number, right: (u: Unit) => number, opt: string): (u: Unit) => number {
			switch (opt) {
				case '+': return function (u: Unit) { return left(u) + right(u) }
				case '-': return function (u: Unit) { return left(u) - right(u) }
				case '*': return function (u: Unit) { return left(u) * right(u) }
				case '/': return function (u: Unit) { return left(u) / right(u) }
			}
		}
	}
	export const config = new Config();
}