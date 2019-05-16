import { Validators, ValidatorFn } from '@angular/forms';
import { FormControlExtension } from './form-control';

export class MessageValidators {

    public static required(message: string) {
        const validate = (control: FormControlExtension) => {
            return MessageValidators.invoke(message, 'required', Validators.required)(control);
        };

        return validate;
    }

    public static max(message: string, value: number) {
        const validate = (control: FormControlExtension) => {
            return MessageValidators.invoke(message, 'max', Validators.max(value))(control);
        };

        return validate;
    }

    public static invoke(message: string, key: string, validator: ValidatorFn) {
        const validate = (control: FormControlExtension) => {
            const errors = validator(control);

            if (control instanceof FormControlExtension && message) {
                if (errors && errors[key]) {
                    control.setMessages(key, message);
                } else {
                    control.removeMessages(key);
                }
            }

            return errors;
        };

        return validate;
    }

}
