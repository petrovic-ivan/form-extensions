import { FormControl, ValidatorFn, AbstractControlOptions, AsyncValidatorFn, Validators } from '@angular/forms';

export class FormControlExtension extends FormControl {
    // tslint:disable-next-line:variable-name
    private _assignedValidators: any;
    // tslint:disable-next-line:variable-name
    private _validatorPairs: [{ name: string, value: string }];
    // tslint:disable-next-line:variable-name
    private _messages: { [key: string]: string };

    constructor(
        formState: any = null,
        validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
        asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
    ) {
        super(formState, validatorOrOpts, asyncValidator);
        this._assignedValidators = validatorOrOpts;
        this._messages = {};
    }

    public get messages(): string[] {
        if (this._messages) {
            return Object.keys(this._messages).map(m => this._messages[m]);
        }
        return [];
    }

    setMessages(validator: string, text: string) {
        if (!this._messages) {
            this._messages = {};
        }
        this._messages[validator] = text;
    }

    removeMessages(validator: string) {
        if (this._messages) {
            delete this._messages[validator];
        }
    }

    getValidators() {
        const validators = [];

        for (const validator of this._assignedValidators) {
            const validatorSignature = validator.toString();
            const name = this.containsValidator(validatorSignature);
            if (name) {
                validators.push(name);
            }
        }

        return validators;
    }

    private containsValidator(validatorSignarure: string): string {
        const validatorPairs = this.setValidatorPairs();
        let validatorName = null;
        for (const validator of validatorPairs) {
            if (validator.value === validatorSignarure) {
                validatorName = validator.name;
                break;
            }
        }
        return validatorName;
    }

    private setValidatorPairs(): [{ name: string, value: string }] {
        if (!this._validatorPairs) {
            const keys = Object.keys(Validators);
            const pairs: [{ name: string, value: string }] = [] as any;
            keys.forEach(name => {
                if (name !== 'compose' && name !== 'composeAsync') {
                    const validator = typeof Validators[name]({}) === 'function' ? Validators[name]({}) : Validators[name];
                    const pair = { name, value: validator.toString() };
                    pairs.push(pair);
                }
            });
            this._validatorPairs = pairs;
        }
        return this._validatorPairs;
    }
}
