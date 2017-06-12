module dragon.kernel0 {
	export class Data {
		private groups: { [k: string]: Group } = {};
		private errGroup = new Group("ERROR GROUP", null);

		public add(groupName: string, data: any) {
			// try {
			groupName = groupName.replace('_txt', '').toLocaleLowerCase();
			data = RES.getRes(data.name);
			this.groups[groupName] = new Group(groupName, data);
			// } catch (error) {
			// 	console.error('配置表' + groupName + '解析错误', error);
			// 	throw error;
			// }
		}
		public group(groupname: string): IGroup {
			groupname = groupname.toLocaleLowerCase();
			var group = this.groups[groupname];
			if (!group) {
				group = this.errGroup;
				console.error("[dragon.data] group [%s] not found", groupname);
			}
			return group;
		}

		public factor(name: string, defaultvalue: number = 0): number {
			var data = this.group('factor').find(name);
			if (data)
				return data.Value;
			else
				return defaultvalue;
		}
		public general(name: string, defaultvalue: string = ""): string {
			var data = this.group('general').find(name);
			if (data)
				return data.Value;
			else
				return defaultvalue;
		}
		public language(name: string, ...param: any[]): Array<egret.ITextElement> {
			var data = this.group('language').find(name);
			if (!data) {
				if (DEBUG) {
					console.error("[dragon.data] language [%s] not found", name);
				}
				return [];
			}
			return (new egret.HtmlTextParser).parser(utils.string.format(data.CN, param));
		}
	}

	interface IGroup {
		/**
		 * find 根据ID来查询数据
		 * @param key 查询的键值
		 * @param prop 查询的属性名称
		 */
		find(key: any, prop?: string): any;
		/**
		 * rand 随机出一个数据
		 */
		rand(): any;
		/**
		 * all 获取所有结果
		 */
		all(): { [k: string]: any };

		length: number;
	}

	class Group implements IGroup {
		private datas: { [k: string]: any };
		private name: string;
		private $length;
		public get length() { return this.$length; }

		public constructor(gname: string, loaddata: string) {
			this.datas = {};
			this.$length = 0;
			this.name = gname;

			if (gname == "ERROR GROUP") {
				// 错误组 无法进行初始化
				return;
			}
			if (!loaddata) {
				console.error('数据表[%s]读取数据失败.', gname);
				return;
			}

			let begin = new Date().getMilliseconds();
			let datas: Array<Array<string>> = [];
			let datas0 = loaddata.split(/\r?\n/);
			for (let i = 0; i < datas0.length; ++i) {
				if (datas0[i].trim() == '') continue
				datas.push(datas0[i].split('\t'));
			}

			if (datas.length < 3) {
				console.error('数据表[%s]读取数据格式错误,应至少三行.', gname);
			}

			let fields: {
				[k: string]: {
					index: number,
					name: string,
					isArray: boolean,
					parser: (str: string) => any
				}
			} = {};
			for (let i = datas[0].length - 1; i >= 0; --i) {
				let source_type = datas[1][i];
				let field = {
					index: i,//第0行是备注
					name: datas[2][i],//第2行是字段名
					isArray: /^list<(.+)>$/i.test(source_type),
					parser: parser(source_type)
				}
				fields[field.name] = field;
			}
			datas.splice(0, 3);//去掉备注，类型，字段名的前三行, 剩下的是可用数据

			let result: { [k: string]: any } = {};
			let idindex = fields['id'].index;
			this.$length = datas.length;
			for (let i = 0; i < datas.length; ++i) {
				let curid = datas[i][idindex];
				result[curid] = { id: curid };//初始化对象表
			}


			for (let fieldName in fields) {
				let field = fields[fieldName];
				if (field.isArray) {
					for (let i = 0; i < datas.length; ++i) {
						let cur_data = datas[i];
						let cur_value = [];
						if (cur_data[field.index].length != 0) {
							let arr = cur_data[field.index].split(';');
							for (let j = 0; j < arr.length; ++j) {
								cur_value.push(field.parser(arr[j]));
							}
						}
						// result[cur_id]-> field.name = cur_value;
						result[cur_data[idindex]][field.name] = cur_value;
					}
				} else {
					for (let i = 0; i < datas.length; ++i) {
						let cur_data = datas[i];
						let cur_value = [];
						// result[cur_id]-> field.name = cur_value;
						result[cur_data[idindex]][field.name] = field.parser(cur_data[field.index]);
					}
				}
			}
			this.datas = result;
		}


		/**
		 * find 根据ID来查询数据
		 * @param key 查询的键值
		 * @param prop 查询的属性名称
		 */
		public find(key: any, prop?: string): any {
			if (!prop) {
				var rtn = this.datas[key];
				if (DEBUG) {
					if (!rtn) {
						console.error('[dragon.data] group:%s 没有键值为[%s]的配置.', this.name, key);
					}
				}
				return rtn;
			} else {
				var result = [];
				for (var i in this.datas) {
					var item = this.datas[i];
					if (item[prop] == key) {
						result.push(item);
					}
				}
				return result;
			}
		}

		/**
		 * rand 随机出一个数据
		 */
		public rand(): any {
			var idx = Math.floor(Math.random() * this.$length);
			for (var k in this.datas) {
				if (idx-- <= 0)
					return this.datas[k];
			}
		}

		/**
		 * all 获取所有结果
		 */
		public all(): { [k: string]: any } {
			return this.datas;
		}
	}
	function parser(type: string): (str: string) => any {
		type = type.replace(/^list<(.+)>$/i, ($1, $2) => $2).toLowerCase();
		if (type == 'number') {
			return Number
		} else if (type == 'string') {
			return (v) => v
		} else if (/^enum<\w+>$/.test(type)) {
			let enum_name = type.replace(/^enum</, '').replace(/>$/, '');
			for (let name in dragon.enums) {
				if (new RegExp(enum_name, 'i').test(name)) {
					return (str) => { return utils.number.isNumber(str) ? Number(str) : dragon.enums[name][str]; }
				}
			}
			throw new Error('错误的枚举定义:' + enum_name);
		}
		throw new Error('错误的类型定义:' + type);
	}
}