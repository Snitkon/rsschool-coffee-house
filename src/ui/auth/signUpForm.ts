import { signUp } from '../../api/auth/authApi';
import { ILogInOrSignIn, ISignUpRequest } from '../../types/types';
import { ErrorHandling } from '../error/errorHandling';
import { Storage } from '../storage/storage';

export class SignUpForm {
  private root!: HTMLElement;
  private form!: HTMLFormElement;
  private loginInput!: HTMLInputElement;
  private passInput!: HTMLInputElement;
  private confirmInput!: HTMLInputElement;
  private cityInput!: HTMLSelectElement;
  private streetInput!: HTMLSelectElement;
  private houseInput!: HTMLInputElement;
  private paymentCash!: HTMLInputElement;
  private paymentCard!: HTMLInputElement;
  private submitBtn!: HTMLButtonElement;
  private errorContainer!: HTMLElement;
  private errorMessages: Map<string, HTMLElement> = new Map();
  private citiesData: { [key: string]: string[] } = {
    Paris: [
      'Champs-Élysées',
      'Rue de Rivoli',
      'Boulevard Saint-Germain',
      'Avenue Montaigne',
      'Rue du Faubourg Saint-Honoré',
      'Boulevard Haussmann',
      'Avenue des Ternes',
      'Rue de la Paix',
      "Avenue de l'Opéra",
      'Rue Saint-Dominique',
    ],
    Berlin: [
      'Unter den Linden',
      'Kurfürstendamm',
      'Friedrichstraße',
      'Alexanderplatz',
      'Potsdamer Platz',
      'Schloßstraße',
      'Hackescher Markt',
      'Oranienburger Straße',
      'Kantstraße',
      'Tauentzienstraße',
    ],
    London: [
      'Oxford Street',
      'Regent Street',
      'Bond Street',
      'Piccadilly',
      'Knightsbridge',
      'Kensington High Street',
      'King’s Road',
      'Covent Garden',
      'Portobello Road',
      'Baker Street',
    ],
  };

  constructor(root: HTMLElement) {
    this.root = root;
    this.createStructure();
    this.setupValidation();
  }

  private createStructure() {
    this.form = document.createElement('form');
    this.form.classList.add('form', 'sign-up-form');
    const loginWrapper = this.createInput(
      'div',
      'form-group',
      'text',
      'login',
      'signup-login',
      'signup-login-id',
      true,
    );
    const passWrapper = this.createInput(
      'div',
      'form-group',
      'password',
      'password',
      'signup-password',
      'signup-password-id',
      true,
    );
    const confirmWrapper = this.createInput(
      'div',
      'form-group',
      'password',
      'confirm password',
      'signup-confirm',
      'signup-confirm-id',
      true,
    ) as HTMLInputElement;

    const cityWrapper = this.createSelect(
      'div',
      'form-group',
      'city',
      'signup-city',
      'signup-city-id',
      true,
      Object.keys(this.citiesData),
    );
    const streetWrapper = this.createSelect(
      'div',
      'form-group',
      'street',
      'signup-street',
      'signup-street-id',
      true,
      [],
    );
    const houseWrapper = this.createInput(
      'div',
      'form-group',
      'number',
      'house number',
      'signup-house',
      'signup-house-id',
      true,
    );
    const cashWrapper = this.createInput(
      'div',
      'form-group-radio',
      'radio',
      'cash',
      'signup-cash',
      'signup-cash-id',
      false,
      'cash',
      'payment',
    ) as HTMLInputElement;
    const cardWrapper = this.createInput(
      'div',
      'form-group-radio',
      'radio',
      'card',
      'signup-card',
      'signup-card-id',
      false,
      'card',
      'payment',
    ) as HTMLInputElement;
    this.paymentCash = cashWrapper.querySelector('input') as HTMLInputElement;
    this.paymentCard = cardWrapper.querySelector('input') as HTMLInputElement;
    this.loginInput = loginWrapper.querySelector('input') as HTMLInputElement;
    this.passInput = passWrapper.querySelector('input') as HTMLInputElement;
    this.confirmInput = confirmWrapper.querySelector('input') as HTMLInputElement;
    this.cityInput = cityWrapper.querySelector('select') as HTMLSelectElement;
    this.streetInput = streetWrapper.querySelector('select') as HTMLSelectElement;
    this.houseInput = houseWrapper.querySelector('input') as HTMLInputElement;
    this.submitBtn = document.createElement('button');
    const text = document.createElement('p');

    this.errorContainer = document.createElement('div');
    this.errorContainer.classList.add('error-container');

    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    const radioContainer = document.createElement('div');
    const radioTitle = document.createElement('div');
    const radioWrapper = document.createElement('div');
    radioContainer.classList.add('form-group');
    radioWrapper.classList.add('radio-wrapper');
    radioWrapper.setAttribute('id', 'radio-wrapper-id');

    radioTitle.classList.add('title');
    radioTitle.textContent = 'Pay by';

    this.submitBtn.setAttribute('type', 'submit');
    this.submitBtn.classList.add('button_secondary', 'auth-btn');
    text.classList.add('text');
    this.submitBtn.textContent = 'Registration';
    text.innerHTML = `If you are registered, <a styles= class='link' href='signin'>sign in</a>`;
    this.submitBtn.disabled = true;

    radioWrapper.append(cashWrapper, cardWrapper);
    radioContainer.append(radioTitle, radioWrapper);

    this.form.append(
      loginWrapper,
      passWrapper,
      confirmWrapper,
      cityWrapper,
      streetWrapper,
      houseWrapper,
      radioContainer,
      this.submitBtn,
      text,
      this.errorContainer,
    );

    this.root.append(this.form);
  }

  private createInput(
    container: string,
    classContainer: string,
    type: string,
    labelText: string,
    _class: string,
    id: string,
    required: boolean,
    value?: string,
    name?: string,
  ): HTMLElement {
    const wrapper = document.createElement(container);
    const label = document.createElement('label');
    const input = document.createElement('input');
    const errorMessage = document.createElement('div');

    wrapper.classList.add(classContainer);
    label.classList.add('label');
    input.classList.add('input');
    input.classList.add(_class);
    errorMessage.classList.add('error-message');

    input.setAttribute('id', id);
    input.setAttribute('autocomplete', 'off');
    label.setAttribute('for', id);

    if (value && name) {
      input.setAttribute('value', value);
      input.setAttribute('name', name);
    }

    label.textContent = labelText[0].toUpperCase() + labelText.slice(1);
    input.type = type;
    input.placeholder = 'Placeholder';
    input.required = required;

    wrapper.append(label, input);
    wrapper.append(errorMessage);
    this.errorMessages.set(id, errorMessage);

    return wrapper;
  }

  private createSelect(
    container: string,
    classContainer: string,
    labelText: string,
    _class: string,
    id: string,
    required: boolean,
    options: string[],
  ): HTMLElement {
    const wrapper = document.createElement(container);
    const label = document.createElement('label');
    const select = document.createElement('select');
    const placeholderOption = document.createElement('option');
    const errorMessage = document.createElement('div');

    wrapper.classList.add(classContainer);
    label.classList.add('label');
    placeholderOption.classList.add('option');
    select.classList.add('select', _class);
    errorMessage.classList.add('error-message');

    select.setAttribute('id', id);
    label.setAttribute('for', id);

    label.textContent = labelText[0].toUpperCase() + labelText.slice(1);
    select.required = required;

    placeholderOption.value = '';
    placeholderOption.textContent = 'Select ' + labelText;
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.append(placeholderOption);

    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      select.append(opt);
    });

    wrapper.append(label, select);

    wrapper.append(errorMessage);
    this.errorMessages.set(id, errorMessage);

    return wrapper;
  }

  private setupValidation() {
    this.loginInput.addEventListener('blur', this.validateLogin.bind(this));
    this.passInput.addEventListener('blur', this.validatePassword.bind(this));
    this.confirmInput.addEventListener('blur', this.validateConfirmPassword.bind(this));
    this.houseInput.addEventListener('blur', this.validateHouse.bind(this));
    this.cityInput.addEventListener('blur', this.validateCity.bind(this));
    this.streetInput.addEventListener('blur', this.validateStreet.bind(this));

    this.loginInput.addEventListener('focus', () => this.clearValidation(this.loginInput));
    this.passInput.addEventListener('focus', () => this.clearValidation(this.passInput));
    this.confirmInput.addEventListener('focus', () => this.clearValidation(this.confirmInput));
    this.houseInput.addEventListener('focus', () => this.clearValidation(this.houseInput));
    this.cityInput.addEventListener('focus', () => this.clearValidation(this.cityInput));
    this.streetInput.addEventListener('focus', () => this.clearValidation(this.streetInput));

    this.loginInput.addEventListener('input', this.checkFormValidity.bind(this));
    this.passInput.addEventListener('input', this.checkFormValidity.bind(this));
    this.confirmInput.addEventListener('input', this.checkFormValidity.bind(this));
    this.houseInput.addEventListener('input', this.checkFormValidity.bind(this));
    this.cityInput.addEventListener('change', this.updateStreets.bind(this));
    this.cityInput.addEventListener('change', this.checkFormValidity.bind(this));
    this.streetInput.addEventListener('change', this.checkFormValidity.bind(this));

    this.paymentCash.addEventListener('change', this.checkFormValidity.bind(this));
    this.paymentCard.addEventListener('change', this.checkFormValidity.bind(this));
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

  private validateHouse(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = +input.value;
    let errorMessage = '';

    if (value < 1) {
      errorMessage = 'House must be more 0';
    }
    this.showValidationResult(input, errorMessage);
  }

  private updateStreets() {
    const selectedCity = this.cityInput.value;
    const streets = this.citiesData[selectedCity] || this.citiesData['Paris'];

    this.streetInput.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Select street';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    this.streetInput.append(placeholderOption);

    streets.forEach(street => {
      const option = document.createElement('option');
      option.value = street;
      option.textContent = street;
      this.streetInput.append(option);
    });
  }

  private clearValidation(input: HTMLInputElement | HTMLSelectElement) {
    const errorElement = this.errorMessages.get(input.id)!;

    input.style.border = '';
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }

  private showValidationResult(input: HTMLInputElement | HTMLSelectElement, errorMessage: string) {
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

  private validateConfirmPassword(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    let errorMessage = '';

    if (value !== this.passInput.value) {
      errorMessage = 'Passwords do not match';
    } else if (!value) {
      errorMessage = 'Confirm password is required';
    }

    this.showValidationResult(input, errorMessage);
  }

  private validateCity(event: Event) {
    const input = event.target as HTMLSelectElement;
    let errorMessage = '';

    if (!input.value) {
      errorMessage = 'Please select a city';
    }

    this.showValidationResult(input, errorMessage);
  }

  private validateStreet(event: Event) {
    const input = event.target as HTMLSelectElement;
    let errorMessage = '';

    if (!input.value) {
      errorMessage = 'Please select a street';
    }

    this.showValidationResult(input, errorMessage);
  }

  private checkFormValidity() {
    const loginValid =
      this.loginInput.value.length >= 3 &&
      /^[a-zA-Z]/.test(this.loginInput.value) &&
      /^[a-zA-Z]+$/.test(this.loginInput.value);

    const passwordValid =
      this.passInput.value.length >= 6 && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(this.passInput.value);

    const confirmPasswordValid = this.confirmInput.value === this.passInput.value && !!this.confirmInput.value;

    const cityValid = !!this.cityInput.value;
    const streetValid = !!this.streetInput.value;
    const houseValid = +this.houseInput.value >= 1;
    const paymentValid = this.paymentCash.checked || this.paymentCard.checked;

    this.submitBtn.disabled = !(
      loginValid &&
      passwordValid &&
      confirmPasswordValid &&
      cityValid &&
      streetValid &&
      houseValid &&
      paymentValid
    );
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();

    const formData: ISignUpRequest = {
      login: this.loginInput.value,
      password: this.passInput.value,
      confirmPassword: this.confirmInput.value,
      city: this.cityInput.value,
      street: this.streetInput.value,
      houseNumber: parseInt(this.houseInput.value),
      paymentMethod: this.paymentCash.checked ? 'cash' : 'card',
    };

    const response = await signUp(formData);

    const errorHandler = new ErrorHandling<ILogInOrSignIn>({
      isErrorText: ' ',
      container: this.errorContainer,
      data: response,
      renderFn: data => {
        Storage.setToken(data.access_token);
        window.location.href = '/menu';
      },
    });
    errorHandler.render();
  }
}
