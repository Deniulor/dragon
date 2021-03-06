module dragon.battle0 {
    export abstract class Battle {

        protected seed: number;
        protected fightId: number;

        public random(): number {
            this.seed = (this.seed * 9301 + 49297) % 233280;
            return this.seed / 233280.0;
        }

        private $view: view.Battle;
        public get view() { return this.$view; }

        protected player: Unit;
        protected pet: Unit;
        protected monster: Monster;
        protected $all: Array<Unit> = [];
        public get all(): Array<Unit> { return this.$all };
        protected bullets: Array<Bullet> = [];

        constructor() {
            this.seed = this.fightId = new Date().getSeconds();
            this.$view = this.createView();
        }

        protected createView(): view.Battle {
            return new view.Battle(this);
        }

        public start() {
            if (!this.inited)
                return console.error('战斗未初始化');
            egret.stopTick(this.update, this);
            egret.startTick(this.update, this);
        }

        protected onUpdate(dt: number) { }

        protected lasttime: number = 0;
        public update(timestamp: number): boolean {
            var dt = (timestamp - this.lasttime) / 1000;
            if (dt > 1000 / 60) dt = 1000 / 60;
            if (this.lasttime == 0) {
                this.lasttime = timestamp;
                return false;
            }
            this.lasttime = timestamp;

            for (var i = this.bullets.length - 1; i >= 0; --i) {
                var bullet: Bullet = this.bullets[i];
                bullet.update(dt);
                if (!bullet.alive()) {
                    this.bullets.splice(i, 1);
                    bullet.removeMoveClip();
                }
            }


            if (this.player.dead) {
                this.lost();
            }
            for (var i = 0; i < this.$all.length; ++i) {
                var unit = this.$all[i];
                if (unit.dead) continue;
                unit.update(dt);
                unit.castSkill();
            }
            this.$view.refresh();
            this.onUpdate(dt);
            return false;
        }


        public onDie(unit: Unit) {
            if (this.player == unit) {
                return this.lost();
            } else if (this.monster == unit) {
                this.win(); // 敌方阵亡
            }
        }

        public lost() {
            egret.stopTick(this.update, this);
            this.onLost();
        }

        public win() {
            egret.stopTick(this.update, this);
            this.onWin();
        }

        private inited: boolean = false;
        public load(param: any) {
            this.addUnit(this.player = this.createPlayer(), enums.Group.Player);

            this.addUnit(this.monster = this.createMonster(), enums.Group.Monster);

            this.addUnit(this.pet = this.createPet(), enums.Group.Pet);

            this.inited = true;
        }

        private addUnit(u: Unit, g: enums.Group) {
            if(!u) return
            u.group = g;
            this.$all.push(u);
            this.$view.addUnit(u);
        }

        public addBullet(bullet: Bullet) {
            bullet.setMovieClip(kernel.effect.repeat(bullet.effect, this.$view.effectLayer));
            this.bullets.push(bullet);
        }

        protected abstract createPlayer(): Unit;
        protected abstract createPet(): Unit;
        protected abstract createMonster(): Monster;

        protected abstract onWin();
        protected abstract onLost();

        public abstract unload();
    }
}