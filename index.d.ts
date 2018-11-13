interface HyperFormOptions {
  /** When true, disable the high-level API. Default: false. */
  strict?: boolean;
  /** Prevent Enter in input fields to submit the form. Default: false. */
  preventImplicitSubmit?: boolean;
  /** Whether and when fields should be re-validated automatically. */
  revalidate?: 'oninput' | 'onblur' | 'hybrid' | 'onsubmit' | 'never'
  /** Whether the non-standard valid event should be triggered. Default: true. */
  validEvent?: boolean;
  /** Whether the <fieldset> element should be treated like a normal input field, e.g. allowing it to receive an error message. Default: true. */
  extendFieldset?: boolean;
  /** Whether input fields with the non-standard attribute novalidate should be exempted from validation. Default: true. */
  novalidateOnElements?: boolean;
  /** CSS class names to use instead of the default ones. */
  classes?: {
    warning?: string,
    valid?: string,
    invalid?: string,
    validated?: string
  }
  /** Whether to include input elements without name attribute as validation candidates. Default: false. */
  validateNameless?: boolean;
}

export interface HyperFormStatic {
  (target: Window | HTMLFormElement, options?: HyperFormOptions): void;
  addValidator(el: HTMLElement, validate: (el: HTMLElement) => boolean): void;
}

declare const HyperForm: HyperFormStatic;

export default HyperForm;
