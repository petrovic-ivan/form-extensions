import { FormGroup, AbstractControl, ValidatorFn, AsyncValidatorFn, AbstractControlOptions } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { combineLatest } from 'rxjs/operators';

export class FormGroupExstension extends FormGroup {
    public touchChanges$ = new Subject<string>();
    public dirtyChanges$ = new Subject<string>();
    public dirtyChangesWithInvalidity$: Observable<{ valid: boolean, dirty: boolean }>;

    constructor(controls: {
        [key: string]: AbstractControl;
    // tslint:disable-next-line:max-line-length
    },          validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
        super(controls, validatorOrOpts, asyncValidator);

        /**
         * If status is disabled than we can consider as valid.
         */
        // tslint:disable-next-line:max-line-length
        this.dirtyChangesWithInvalidity$ = this.statusChanges.pipe(combineLatest(this.dirtyChanges$, (status, dirty) => ({ valid: status === 'VALID' || status === 'DISABLED', dirty: dirty === 'DIRTY' })));
    }

    /**
     * Overriden `markAsTouched()` function.
     * @param opts Optional parameters.
     */
    public markAsTouched(opts?: {
        onlySelf?: boolean;
    }) {
        opts ? super.markAsTouched(opts) : super.markAsTouched();
        this.touchChanges$.next('TOUCHED');
    }

    /**
     * Overriden `markAsDirty()` function.
     * @param opts Optional parameters.
     */
    public markAsDirty(opts?: {
        onlySelf?: boolean;
    }) {
        opts ? super.markAsDirty(opts) : super.markAsDirty();
        this.dirtyChanges$.next('DIRTY');
    }

}
