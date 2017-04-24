module dragon.kernel0 {

	export interface INetwork {
		login(host: string, entry: string, param: any, callback: (msg: any) => void);
		notify(event: string, param: any);
		request(op: string, param: any, callback: (msg: any) => void, err?: (event: string, code: number, msg: string) => void);
		on(op: string, callback: (msg: any) => void, err?: (event: string, code: number, msg: string) => void);
		off(op: string, callback?: (msg: any) => void);
		connected(): boolean;
	}

	class Request {
		public id: number;
		public event: string;
		public param: any;
		public callback: (msg: any) => void;
		public errcb: (head: any, code: number, msg: string) => void;
		public sendTime: number;

		public Request() {
		}
	}

	enum MessageType {
		None, // 空白定义
		/**
		 * 对request的反馈，无需回包
		 */
		Response,
		/**
		 * 向其他服务器请求，必定回包
		 */
		Request,
		/**
		 * 向其他服务器发送监控信息，无需回包
		 */
		Notify,
	}

	export class Network implements INetwork {

		private webSocket: egret.WebSocket;

		private host: string = "10.0.0.1";
		private port: number = 9999;

		private callbacks = {};
		private requests: { [k: string]: Request } = {};
		private handledMsg: Array<string> = [];
		private requestid: number = egret.getTimer() % 20000;
		private losts = [];
		private showMessage = false;

		private loginparam: any;
		private loginentry: string;

		private loginCallback: Function;
		private reconnect = -1;

		private timer = null;

		private onSocketOpen() {
			console.log("The connection is successful, : " + this.host + ":" + this.port);
			kernel.net.request('base.serverinfo', {}, (data) => {
				kernel.storage.set('serverhost', this.host + ":" + this.port);
				kernel.net.request(this.loginentry, this.loginparam, (data) => {
					this.losts.forEach((req) => {
						if (DEBUG) {
							if (this.showMessage) {
								console.log('[send]: %s:[%s]', req.head.event, JSON.stringify(req.param));
							}
						}
						this.write(req.head, req.param);
					});
					this.losts = [];
					if (this.loginCallback) {
						this.loginCallback(data);
						this.loginCallback = null;
					}
				}, (event, code, msg) => {
					manager.notice.addPrompt(msg); //封号
					this.webSocket.close();
				});
			}, (event: string, code: number, msg: string) => {
				console.error("无法连接游戏服务器.请确认网络连接无异常.[code:%s, msg:%s]", code, msg);
			});
		}

		private onReceiveMessage(e: egret.Event) {
			//创建 ByteArray 对象
			var byte: egret.ByteArray = new egret.ByteArray();
			//读取数据
			this.webSocket.readBytes(byte);

			var head = {
				messageType: 0,
				srcType: 0,
				srcId: 0,
				descType: 0,
				descId: 0,
				event: "",
				sequence: 0,
				errcode: 0,// response时才有意义
			};

			head.messageType = byte.readByte();
			head.srcType = byte.readByte();
			head.srcId = (byte.readInt() << 32) + byte.readInt();
			head.descType = byte.readByte();
			head.descId = (byte.readInt() << 32) + byte.readInt();
			head.event = byte.readUTF().toLocaleLowerCase();
			head.sequence = byte.readShort();
			head.errcode = byte.readShort();
			var msghash = head.event + '@' + head.sequence;
			if (head.messageType == MessageType.Response && this.handledMsg.indexOf(msghash) != -1) {
				//消息已经处理过
				return;
			}
			var body = head.errcode != 0 ? byte.readUTF() : JSON.parse(byte.readUTF());
			if (DEBUG) {
				if (this.showMessage) {
					console.log('[receive]: %s:%s', head.event, JSON.stringify(body));
				}
			}

			var list = this.callbacks[head.event];
			if (list) {
				for (var i = 0; i < list.length; ++i) {
					var fn = list[i];
					if (!fn) {
						continue;
					}
					if (head.errcode) {
						var errcb = fn['errcb'] || this.defaultErrCb;
						errcb(head.event, head.errcode, body);
					} else {
						fn(body);
					}
				}
			}

			var req: Request = null;
			if (head.sequence != 0 && (req = this.requests[head.sequence])) {
				delete this.requests[head.sequence];
				if (head.errcode) {
					var errcb0 = req.errcb || this.defaultErrCb;
					errcb0(head.event, head.errcode, body);
				} else {
					req.callback(body);
				}
			}
			if (!list && !req) {
				console.error('未监听服务端[%s]消息', head.event);
			}

			if (head.messageType == MessageType.Response) {
				this.handledMsg.unshift(msghash);
				if (this.handledMsg.length > 30) {
					this.handledMsg.pop();
				}
			}
		}

		private onClosed() {
			this.webSocket.close();
		}

		private onError(error) {
			if (this.reconnect != -1) {
				return;
			}
			manager.notice.addPrompt('网络连接失败3秒后重试');
			this.reconnect = egret.setTimeout(() => {
				this.connect(this.host, this.port);
				this.reconnect = -1;
			}, this, 3000);
		}

		private defaultErrCb(event: string, code: number, msg: string) {
			console.log("消息[%s]处理失败, 错误码:%s, 附加消息:%s", event, code, msg);
		}

		private timeCheck() {
			var now = new Date().getTime();
			for (var key in this.requests) {
				var req = this.requests[key];
				if (req.sendTime < now - 15000) { // 15秒
					req.sendTime = now;
					console.log('消息重发：%s, %s', req.event, req.id);
					this.write({
						messageType: MessageType.Request,
						event: req.event,
						sequence: req.id
					}, req.param);
				}
			}
		}

		private getRequestInfo(): any {
			var url = location.search; //获取url中"?"符后的字串
			var theRequest = {};
			if (url.indexOf("?") != -1) {
				var strs = url.substr(1).split("&");
				for (var i = 0; i < strs.length; i++) {
					var param = strs[i].split("=");
					theRequest[param[0]] = decodeURIComponent(param[1]);
				}
			}
			return theRequest;
		}

		private write(
			head: { messageType: number, event: string, sequence: number },
			message: any) {


			//创建 ByteArray 对象
			var byte: egret.ByteArray = new egret.ByteArray();
			byte.writeByte(head.messageType);//消息类型
			byte.writeShort(head.sequence);//消息序列号
			byte.writeUTF(head.event);//数据类型
			byte.writeUTF(JSON.stringify(message));//消息体
			byte.position = 0;
			//发送数据
			this.webSocket.writeBytes(byte, 0, byte.bytesAvailable);
		}

		//------------------- 接口实现 -------------------
		private connect(host: string, port: number) {
			if (this.webSocket && this.webSocket.connected
				&& this.host == host && this.port == port) {
				return;
			}
			if (kernel.storage.get("ShowDebugMessage") == "ON") {
				this.showMessage = true;
			}
			this.host = host;
			this.port = port;
			if (!this.webSocket) {
				this.webSocket = new egret.WebSocket();
				this.webSocket.type = egret.WebSocket.TYPE_BINARY;
				this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
				this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
				this.webSocket.addEventListener(egret.Event.CLOSE, this.onClosed, this);
				this.webSocket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
			} try {
				this.webSocket.close();
				egret.setTimeout(this.webSocket.connect, this.webSocket, 0, host, port);
			} catch (error) {
				this.onError(error);
			}
		}

		public login(host: string, entry: string, param: any, callback: (msg: any) => void) {
			var ip = host.substr(0, host.indexOf(":"));
			var port = parseInt(host.substr(host.indexOf(":") + 1, host.length));
			this.connect(ip, port);
			this.loginentry = entry;
			this.loginparam = param;
			this.loginCallback = callback;
			if (!this.timer)
				this.timer = egret.setInterval(this.timeCheck, this, 1000);
		}

		public notify(event: string, param: any) {
			event = event.toLocaleLowerCase();
			var head = {
				messageType: MessageType.Notify,
				event: event,
				sequence: 0
			};
			if (!this.webSocket || !this.webSocket.connected) {
				this.losts.push({ head: head, param: param });
				this.connect(this.host, this.port);
				return;
			}
			if (DEBUG) {
				if (this.showMessage) {
					console.log('[send]: %s:%s', event, JSON.stringify(param));
				}
			}
			this.write(head, param);
		}

		public request(event: string, param: any, callback: (msg: any) => void, err?: (event: string, code: number, msg: string) => void) {
			event = event.toLocaleLowerCase();
			// 发送请求
			var req: Request = new Request();
			req.id = this.requestid++;
			req.event = event;
			req.param = param;
			req.callback = callback;
			req.errcb = err;
			this.requests[req.id] = req; //记录请求
			//调整requestid
			if (this.requestid >= 30000) {
				this.requestid = 1;
			}

			var head = {
				messageType: MessageType.Request,
				event: event,
				sequence: req.id
			};
			if (!this.webSocket || !this.webSocket.connected) {
				this.losts.push({ head: head, param: param });
				this.connect(this.host, this.port);
				return;
			}
			if (DEBUG) {
				if (this.showMessage) {
					console.log('[send]: %s:%s', event, JSON.stringify(param));
				}
			}
			this.write(head, param);
			req.sendTime = new Date().getTime();
		}

		public on(event: string, cb: (msg: any) => void, errcb?: (event: string, code: number, msg: string) => void) {
			event = event.toLocaleLowerCase();
			// 发起对event的监听
			var list = this.callbacks[event] || (this.callbacks[event] = []);
			if (errcb) {
				cb['errcb'] = errcb;
			}
			list.push(cb);
		}

		public off(event: string, callback?: (msg: any) => void) {
			event = event.toLocaleLowerCase();
			// 取消对event的监听
			var list = this.callbacks[event];
			if (!list) {
				return;
			}
			if (!callback) {
				this.callbacks[event] = [];
				return;
			}
			for (var i = 0; i < list.length; ++i) {
				if (list[i] === callback) {
					list.splice(i, 1);
				}
			}
		}

		public connected(): boolean {
			return this.webSocket && this.webSocket.connected;
		}
	}
}