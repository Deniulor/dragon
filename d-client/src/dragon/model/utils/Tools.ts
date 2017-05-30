module dragon.tools {
    export enum Platform {
        None, PC
    }
    export function platform(): Platform {
        return Platform.PC;
    }
}