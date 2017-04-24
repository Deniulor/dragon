module dragon.battle0 {
    export abstract class Battle {

        private $view: view.Battle;
        public get view() { return this.$view; }

        private self: Unit;

        constructor() {
            this.$view = this.createView();
        }

        protected createView(): view.Battle {
            return new view.Battle(this);
        }

        public start() {
            egret.stopTick(this.update, this);
            egret.startTick(this.update, this);
        }

        public update(dt: number): boolean {
            return true;
        }

        public load(param: any) {
            this.initSelf();
            this.initOppo();
        }
        protected initSelf() {

        }
        protected initOppo() {

        }

        public unload() {

        }
    }
}