export class OrderCode {
    readonly value: string;

    constructor(sequence: number, date = new Date()) {
        this.value = this.generate(sequence, date);
    }

    private generate(sequence: number, date: Date) {
        return `${date.getFullYear()}${new String(sequence).padStart(8, "0")}`;
    }
}
