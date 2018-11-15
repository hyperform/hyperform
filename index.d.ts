interface HyperformOptions {
  /** When true, disable the high-level API. Default: false. */
  strict?: boolean;

  /** Prevent Enter in input fields to submit the form. Default: false. */
  preventImplicitSubmit?: boolean;

  /** Whether and when fields should be re-validated automatically. */
  revalidate?: 'oninput' | 'onblur' | 'hybrid' | 'onsubmit' | 'never';

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

export interface HyperformRenderer {
  /** called when a warning should become visible */
  attachWarning: (warning: HTMLElement, element: HTMLElement) => void;

  /** called when a warning should vanish */
  detachWarning: (warning: HTMLElement, element: HTMLElement) => void;

  /** called when feedback to an element's state should be handled ie: showing and hiding warnings */
  showWarning: (element: HTMLElement, wholeFormValidated: boolean) => void;

  /** set the warning's content */
  setMessage: (warning: HTMLElement, message: string, element: HTMLElement) => void;
}

export interface HyperformValidator {
  (element: HTMLElement): boolean;
}

export interface HyperformStatic {
  version: string;

  /** initializes hyperform on a specific form or globally */
  (target: Window | HTMLFormElement, options?: HyperformOptions): void;

  /** TODO: add documentation */
  ValidityState(element: HTMLElement): ValidityState;

  /** check, if an element will be subject to HTML5 validation at all */
  willValidate(element: HTMLElement): boolean;

  /** represents the value of the element, interpreted as a date */
  valueAsDate(element: HTMLElement, value: any): Date | null;

  /** represents the value of the element, interpreted as a number */
  valueAsNumber(element: HTMLElement, value: any): Number;
  
  /** add custom validation logic for specific elements */
  addValidator(element: HTMLElement, validate: HyperformValidator): void;
  
  /** override default renderer methods */
  setRenderer<T extends keyof HyperformRenderer>(renderer: T, action: HyperformRenderer[T]): void;
  
  /** check an element's validity with respect to it's form */
  checkValidity(element: HTMLElement): boolean;
  
  /** check element's validity and report an error back to the user */
  reportValidity(element: HTMLElement): boolean;
  
  /** set a custom validity message or delete it with an empty string */
  setCustomValidity(element: HTMLElement, message: string): void;
  
  /** TODO: add documentation */
  stepDown(element: HTMLElement, amount: number): void;
  
  /** TODO: add documentation */
  stepUp(element: HTMLElement, amount: number): void;
  
  /** get the validation message for an element, empty string, if the element satisfies all constraints. */
  validationMessage(element: HTMLElement): string;
  
  /** set the language for Hyperform’s messages */
  setLanguage(lang: string): HyperformStatic;
  
  /** add a lookup catalog "string: translation" for a language */
  addTranslation(lang: string, catalog: any): HyperformStatic;
  
  /** register custom error messages per element */
  setMessage(element: HTMLElement, validator: HyperformValidator, message: string): HyperformStatic;
  
  /** TODO: add documentation and types */
  addHook(hook: any, action: any, position: any): HyperformStatic;
  
  /** TODO: add documentation and types */
  removeHook(hook: any, action: any): HyperformStatic;
}

declare const Hyperform: HyperformStatic;

export default Hyperform;
