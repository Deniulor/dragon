module dragon.kernel0 {
	export interface IData {
		add(groupName: string, data: string);
		group(name: string): IGroup;
		factor(name: string, defaultvalue?: number): number;
		general(name: string, defaultvalue?: string): string;
		language(name: string): string;
	}
	export class Data implements IData {
		private groups: { [k: string]: Group } = {};
		private errGroup = new Group("ERROR GROUP", null);

		public add(groupName: string, data: any) {
			groupName = groupName.replace('_txt', '').toLocaleLowerCase();
			data = RES.getRes(data.name);
			this.groups[groupName] = new Group(groupName, data);
		}
		public group(groupname: string): IGroup {
			groupname = groupname.toLocaleLowerCase();
			var group = this.groups[groupname];
			if (!group) {
				group = this.errGroup;
				console.error("[legend.data] group [%s] not found", groupname);
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
		public language(name: string): string {
			var data = this.group('language').find(name);
			if (data)
				return data.CN;
			else {
				if (DEBUG) {
					console.error("[legend.data] language [%s] not found", name);
				}
				return '';
			}
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

		public constructor(name: string, data: string) {
			this.datas = {};
			this.$length = 0;
			this.name = name;

			if (name == "ERROR GROUP") {
				// 错误组 无法进行初始化
				return;
			}
			if (!data) {
				console.error('数据[%s]读取数据失败.', name);
				return;
			}

			var begin = new Date().getMilliseconds();
			var datas = data.split(/\r?\n/);
			var fields: { [k: number]: string } = {};
			datas[1].split('\t').forEach(function (i, k) {
				if (i.length <= 0 || i.charAt(0) == '#') {
					return;
				}
				fields[i] = k;
			});
			datas.splice(0, 2);

			var result = {}, item;

			for (var i = 0; i < datas.length; ++i) {
				var k = datas[i];
				if (k.trim() == '') {
					continue;
				}
				item = mapData(fields, k.split('\t'));
				if (result[item.id] != undefined) {
					console.error('[%s]表有重复的id[%s]', this.name, item.id);
				} else {
					this.$length++;
				}
				result[item.id] = item;
			}

			this.datas = result;
		}

		public get length() {
			return this.$length;
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
						console.error('[legend.data] group:%s 没有键值为[%s]的配置.', this.name, key);
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

	function mapData(fields: { [k: number]: string }, item) {
		var obj = {};
		for (var k in fields) {
			var va = item[fields[k]];
			// 解析成列表
			if (k.search("List$") != -1) {
				var temp = [];
				if (va.length > 0) {
					va = va.split(';');
					for (var index = 0; index < va.length; index++) {
						var value = va[index];
						if (isNum(value)) {
							value = Number(value);
						}
						temp.push(value);
					}
				}
				va = temp;
			} else {
				if (isNum(va)) {
					va = Number(va);
				}
			}
			obj[k] = va;
		}
		return obj;
	}

	function isNum(s) {
		if (typeof s == 'number')
			return true;
		if (typeof s != 'string')
			return false;

		if (s != null) {
			var r, re;
			re = /-?\d*\.?\d*/i; //\d表示数字,*表示匹配多个数字
			r = s.match(re);
			return (r == s) ? true : false;
		}
		return false;
	}
}