export class Cpf {
    FIRST_DIGIT_FACTOR = 10;
    SECOND_DIGIT_FACTOR = 11;

    private _value: string;

    constructor(cpfInputValue: string) {
        if (!this.isValid(cpfInputValue)) throw new Error("Cpf inválido");
        this._value = cpfInputValue;
    }

    get value() {
        return this._value;
    }

    private isValid(cpf: string) {
        cpf = this.clearInvalidCharacters(cpf);
        if (!this.isValidLength(cpf) || this.isAllTheSameCharacters(cpf)) {
            return false;
        }
        const firstDigit = this.calculateDigit(cpf, this.FIRST_DIGIT_FACTOR);
        const secondDigit = this.calculateDigit(cpf, this.SECOND_DIGIT_FACTOR);
        return this.checkDigits(cpf, firstDigit, secondDigit);
    }

    private clearInvalidCharacters(cpf: string) {
        return cpf.replace(/\D+/g, "");
    }

    private isValidLength(cpf: string) {
        return cpf.length === 11;
    }

    private isAllTheSameCharacters(cpf: string) {
        return cpf.split("").every((character) => character === cpf[0]);
    }

    private calculateDigit(cpf: string, factor: number) {
        let total = 0;
        for (const value of cpf) {
            if (factor > 1) {
                total += parseInt(value) * factor--;
            }
        }
        return this.getDigit(total);
    }

    private getDigit(value: number) {
        const rest = value % 11;
        return rest < 2 ? 0 : 11 - rest;
    }

    private checkDigits(cpf: string, firstDigit: number, secondDigit: number) {
        const cpfVefiryDigits = this.getverifyDigit(cpf);
        const calculatedVerifyDigits = `${firstDigit}${secondDigit}`;
        return cpfVefiryDigits == calculatedVerifyDigits;
    }

    private getverifyDigit(cpf: string) {
        return cpf.slice(-2);
    }
}
