namespace dragon {
    class Kernel {
        /**
         * layers 游戏不同层之间的管理器
         */
        private $ui: kernel0.IUiManager;
        get ui(): kernel0.IUiManager { return this.$ui; }

        /**
         * net 网络连接管理器
         */
        private $net: kernel0.INetwork;
        get net(): kernel0.INetwork { return this.$net; }

        /**
         * storage 本地数据存储器 
         */
        private $storage: kernel0.ILocalStorage;
        get storage(): kernel0.ILocalStorage { return this.$storage; }

        /**
         * net 网络连接管理器
         */
        private $data: kernel0.Data;
        get data(): kernel0.Data { return this.$data; }

        /**
         * effect 特效管理器
         */
        private $effect: kernel0.IEffect;
        get effect(): kernel0.IEffect { return this.$effect; }

        private $event: egret.EventDispatcher;
        get event(): egret.EventDispatcher { return this.$event; }

        public init(): void {
            this.$ui = new dragon.kernel0.UI();
            this.$net = new dragon.kernel0.Network();
            this.$storage = new dragon.kernel0.LocalStorage();
            this.$data = new dragon.kernel0.Data();
            this.$effect = new dragon.kernel0.EffectManager();
            this.$event = new egret.EventDispatcher();
        }
    }

    /**
     * @kernel 游戏内核
     */
    export const kernel: Kernel = new Kernel();
}