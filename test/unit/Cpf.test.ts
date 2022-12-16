import { Cpf } from "src/domain/valueObject/Cpf";

describe("CPF", () => {
    test("Deve criar um Cpf se fornecido um cpf válido", () => {
        const cpf = new Cpf("111.444.777-35");
        expect(cpf.value).toBe("111.444.777-35");
    });

    test("Deve criar um Cpf se fornecido um cpf válido com digito verificador 00", () => {
        const cpf = new Cpf("650.137.840-00");
        expect(cpf.value).toBe("650.137.840-00");
    });

    test("Deve lançar um Erro se fornecido um cpf inválido", () => {
        expect(() => new Cpf("011.444.777-35")).toThrow("Cpf inválido");
    });

    test("Deve lançar um Erro se fornecido uma string qualquer ao invés de um cpf", () => {
        expect(() => new Cpf("cpf.cpf.cpf-in")).toThrow("Cpf inválido");
    });

    test("Deve lançar um Erro se fornecido um cpf com mais de 14 caracteres", () => {
        expect(() => new Cpf("111.444.777.999")).toThrow("Cpf inválido");
    });

    test("Deve lançar um Erro se fornecido um cpf com os caracteres iguais", () => {
        expect(() => new Cpf("111.111.111-11")).toThrow("Cpf inválido");
    });
});
