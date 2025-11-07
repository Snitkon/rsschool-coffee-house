export class ErrorBoundary {
  private container: HTMLDivElement;
  private errorTitle: string;
  private isErrorText: string;

  constructor({ errorTitle, isErrorText = '' }: { errorTitle: string; isErrorText?: string }) {
    this.container = document.createElement('div');
    this.errorTitle = errorTitle;
    this.isErrorText = isErrorText;
  }

  renderErrorBounder(): HTMLElement {
    const wrapper = document.createElement('div');
    const errorTitle = document.createElement('h3');
    const errorText = document.createElement('p');

    this.container.classList.add('error__container');
    wrapper.classList.add('error__wrapper');
    errorTitle.classList.add('error__title');
    errorText.classList.add('error__text');

    if (!this.isErrorText) {
      errorTitle.setAttribute('data-i18n', 'error.message');
      errorText.setAttribute('data-i18n', 'error.text');
    } else {
      errorTitle.textContent = this.errorTitle;
      errorText.textContent = this.isErrorText;
    }
    wrapper.append(errorTitle, errorText);
    this.container.appendChild(wrapper);

    return this.container;
  }
}
