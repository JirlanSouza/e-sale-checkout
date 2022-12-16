export interface CalculatefreightGatway {
    calculate(input: CalculatefreightInput): Promise<number>;
}

type CalculatefreightInput = {
    items: { volume: number; density: number; quantity: number }[];
    from: string;
    to: string;
};
