module dragon.utils {
	class Time {
		public init() {
			//和服务端时间同步
		}
		public TimeMin = 60;
		public TimeHour = this.TimeMin * 60;
		public TimeDay = this.TimeHour * 24;
		public TimeWeek = this.TimeDay * 7;

		public toFriendly(time: number): string {
			var itl = this.getInterval(time);
			if (itl > this.TimeWeek) {
				return (itl / this.TimeWeek).toFixed() + '周前';
			} else if (itl > this.TimeDay) {
				return (itl / this.TimeDay).toFixed() + '天前';
			} else if (itl > this.TimeHour) {
				return (itl / this.TimeHour).toFixed() + '小时前';
			} else if (itl > this.TimeMin) {
				return (itl / this.TimeMin).toFixed() + '分钟前';
			} else {
				return '刚刚';
			}
		}

		public toTimeHour(itl: number): string {
			//时
			let str = ('00' + Math.floor(itl / this.TimeHour)).slice(-2) + ':';
			itl = itl % this.TimeHour;
			//分
			str += ('00' + Math.floor(itl / this.TimeMin)).slice(-2) + ':';
			itl = itl % this.TimeMin;
			//秒
			str += ('00' + Math.floor(itl)).slice(-2);
			return str;
		}

		public toSeconds(time: string): number {
			var index = time.indexOf(':');
			var hours = (Number)(time.substring(0, index));
			var minutes = (Number)(time.substring(index + 1, time.length));
			var seconds = hours * this.TimeHour + minutes * this.TimeMin
			return seconds;
		}

		public format(time: number) {
			var t = new Date(time);
			var y = t.getFullYear();
			var m = t.getMonth() + 1;
			var d = t.getDate();
			return y + '年' + m + '月' + d + '日';
		}

		public toDayTime(t: number) {
			var rtn = '';
			if (t >= this.TimeDay) {
				rtn += (t / this.TimeDay).toFixed() + '天';
				t = t % this.TimeDay;
			}
			if (t >= this.TimeHour) {
				rtn += (t / this.TimeHour).toFixed() + '小时';
				t = t % this.TimeHour;
			}
			if (t >= this.TimeMin) {
				rtn += (t / this.TimeMin).toFixed() + '分';
				t = t % this.TimeMin;
			}
			if (t > 0) {
				rtn += t + '秒';
			}
			return rtn;
		}

		/** 
		 *  1970 到现在的获取时间戳
		 */
		public timestamp(): number {
			return Math.floor(new Date().getTime() / 1000);
		}

		/**
		 * 获取现在之前距离到现在的时间，单位秒
		 */
		public getInterval(before: number): number {
			return (new Date().getTime() / 1000 - before);
		}

		/*
		*	将时间戳转为 2017-02-04 00:00:00 的形式
		*/
		public timeToformat(time?: number): string {
			var t;
			if (time) {
				t = new Date(time);
			} else {
				t = new Date();
			}
			var y = t.getFullYear();
			var m = ('00' + Math.floor(t.getMonth() + 1)).slice(-2);
			var d = ('00' + Math.floor(t.getDate())).slice(-2);
			var h = ('00' + Math.floor(t.getHours())).slice(-2);
			var mm = ('00' + Math.floor(t.getMinutes())).slice(-2);
			var s = ('00' + Math.floor(t.getSeconds())).slice(-2);
			return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;
		}
	}
	export const time: Time = new Time();
}