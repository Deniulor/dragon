module dragon.utils {
    export module tools {
        export enum Platform {
            None, PC
        }
        export function platform(): Platform {
            return Platform.PC;
        }

        export function initModel(m: any) {
            for (let k in m) {
                m[k].init && m[k].init();
            }
        }
        export function getColor(quantity: enums.Quality) {
            switch (quantity) {
                case enums.Quality.Legend: return '#9840BE';
                case enums.Quality.Epic: return '#FF7100';
                case enums.Quality.Perfect: return '#A6A500';
                case enums.Quality.Rare: return '#4A60D7';
                case enums.Quality.Magic: return '#4BB814';
                case enums.Quality.Basic:
                default: return '#747474';
            }
        }
    }
}