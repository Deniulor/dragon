module dragon {
    class Manager {
        protected $notice: model.NotiveManager;
        public get notice(): model.NotiveManager { return this.$notice }

        public constructor() {
        }
        public init() {
            this.$notice = new model.NotiveManager();
            this.$notice.init(kernel.ui.noticeLayer);
        }
    }
    export const manager: Manager = new Manager();
}