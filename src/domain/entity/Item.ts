import { Dimension } from "../valueObject/Dimension";

export class Item {
    constructor(
        readonly idItem: string,
        readonly description: string,
        readonly price: number,
        readonly dimension?: Dimension,
    ) {}

    getVolume() {
        return this.dimension?.getVolume() ?? 0;
    }

    getDensity() {
        return this.dimension?.getDensity() ?? 0;
    }
}
