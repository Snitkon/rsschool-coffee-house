import { logIn } from '../../api/auth/authApi';
import { ILogInOrSignIn, ILogInRequest } from '../../types/types';
import { ErrorHandling } from '../error/errorHandling';

export class SignInForm {
  private root!: HTMLElement;
  private form!: HTMLFormElement;
  private loginInput!: HTMLInputElement;
  private passInput!: HTMLInputElement;
  private submitBtn!: HTMLButtonElement;
  private errorContainer!: HTMLElement;
  private errorMessages: Map<string, HTMLElement> = new Map();

  constructor(root: HTMLElement) {
    this.root = root;
    this.createStructure();
    this.setupValidation();
  }

  private createStructure() {
    this.form = document.createElement('form');
    this.form.classList.add('form', 'sign-in-form');

    const loginWrapper = this.createInput('text', 'login', 'signup-login', 'signup-login-id', true);
    const passWrapper = this.createInput('password', 'password', 'signup-password', 'signup-password-id', true);

    this.loginInput = loginWrapper.querySelector('input') as HTMLInputElement;
    this.passInput = passWrapper.querySelector('input') as HTMLInputElement;
    this.submitBtn = document.createElement('button');

    this.errorContainer = document.createElement('div');
    this.errorContainer.classList.add('error-container');

    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    this.submitBtn.setAttribute('type', 'submit');
    this.submitBtn.classList.add('button_secondary', 'auth-btn');
    this.submitBtn.textContent = 'Sign In';
    this.submitBtn.disabled = true;

    this.form.append(loginWrapper, passWrapper, this.submitBtn, this.errorContainer);

    this.root.append(this.form);
  }

  private createInput(type: string, labelText: string, _class: string, id: string, required: boolean): HTMLElement {
    const wrapper = document.createElement('div');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const errorMessage = document.createElement('div');

    wrapper.classList.add('form-group');
    label.classList.add('label');
    input.classList.add('input');
    input.classList.add(_class);
    errorMessage.classList.add('error-message');

    input.setAttribute('id', id);
    input.setAttribute('autocomplete', 'off');
    label.setAttribute('for', id);

    label.textContent = labelText[0].toUpperCase() + labelText.slice(1);
    input.type = type;
    input.placeholder = 'Placeholder';
    input.required = required;

    wrapper.append(label, input);
    wrapper.append(errorMessage);
    this.errorMessages.set(id, errorMessage);

    return wrapper;
  }

  private setupValidation() {
    this.loginInput.addEventListener('blur', this.validateLogin.bind(this));
    this.passInput.addEventListener('blur', this.validatePassword.bind(this));
    this.loginInput.addEventListener('focus', () => this.clearValidation(this.loginInput));
    this.passInput.addEventListener('focus', () => this.clearValidation(this.passInput));
    this.loginInput.addEventListener('input', this.checkFormValidity.bind(this));
    this.passInput.addEventListener('input', this.checkFormValidity.bind(this));
  }

  private validateLogin(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    let errorMessage = '';

    if (value.length < 3) {
      errorMessage = 'Login must be at least 3 characters long';
    } else if (!/^[a-zA-Z]/.test(value)) {
      errorMessage = 'Login must start with a letter';
    } else if (!/^[a-zA-Z]+$/.test(value)) {
      errorMessage = 'Login must contain only English alphabet letters';
    }

    this.showValidationResult(input, errorMessage);
  }

  private validatePassword(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    let errorMessage = '';

    if (value.length < 6) {
      errorMessage = 'Password must be at least 6 characters long';
    } else if (!/[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/.test(value)) {
      errorMessage = 'Password must contain at least 1 special character';
    }

    this.showValidationResult(input, errorMessage);
  }

  private clearValidation(input: HTMLInputElement) {
    const errorElement = this.errorMessages.get(input.id)!;

    input.style.border = '';
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }

  private showValidationResult(input: HTMLInputElement, errorMessage: string) {
    const errorElement = this.errorMessages.get(input.id)!;

    if (errorMessage) {
      input.style.border = '2px solid red';
      errorElement.textContent = errorMessage;
      errorElement.style.display = 'block';
    } else {
      this.clearValidation(input);
    }

    this.checkFormValidity();
  }

  private checkFormValidity() {
    const loginValid =
      this.loginInput.value.length >= 3 &&
      /^[a-zA-Z]/.test(this.loginInput.value) &&
      /^[a-zA-Z]+$/.test(this.loginInput.value);

    const passwordValid =
      this.passInput.value.length >= 6 && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(this.passInput.value);

    this.submitBtn.disabled = !(loginValid && passwordValid);
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();

    const formData: ILogInRequest = {
      login: this.loginInput.value,
      password: this.passInput.value,
    };

    const response = await logIn(formData);

    const errorHandler = new ErrorHandling<ILogInOrSignIn>({
      container: this.errorContainer,
      data: response,
      renderFn: () => {
        this.errorContainer.textContent = 'Registration successful!';
        this.errorContainer.style.color = 'green';
        window.location.href = '/menu';
      },
    });
    errorHandler.render();
  }
}
