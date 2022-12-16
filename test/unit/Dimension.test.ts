import { Dimension } from "src/domain/valueObject/Dimension";

describe("Dimension", () => {
    test("Should be able create dimension", () => {
        const dimension = new Dimension(100, 30, 10, 3);
        expect(dimension.getVolume()).toBe(0.03);
        expect(dimension.getDensity()).toBe(100);
    });

    test("Should not be able create dimension with invalid width", () => {
        expect(() => new Dimension(-100, 30, 10, 3)).toThrow(
            new Error("Invalid dimension"),
        );
    });

    test("Should not be able create dimension with invalid height", () => {
        expect(() => new Dimension(100, -30, 10, 3)).toThrow(
            new Error("Invalid dimension"),
        );
    });

    test("Should not be able create dimension with invalid length", () => {
        expect(() => new Dimension(100, 30, -10, 3)).toThrow(
            new Error("Invalid dimension"),
        );
    });

    test("Should not be able create dimension with invalid weight", () => {
        expect(() => new Dimension(100, 30, 10, -3)).toThrow(
            new Error("Invalid dimension"),
        );
    });
});
