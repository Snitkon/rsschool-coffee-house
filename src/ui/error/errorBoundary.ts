export class ErrorBoundary {
  private container: HTMLDivElement;
  private errorTitle: string;

  constructor({ errorTitle }: { errorTitle: string }) {
    this.container = document.createElement('div');
    this.errorTitle = errorTitle;
  }

  renderErrorBounder(): HTMLElement {
    const wrapper = document.createElement('div');
    const errorTitle = document.createElement('h3');
    const errorText = document.createElement('p');

    this.container.classList.add('error__container');
    wrapper.classList.add('error__wrapper');
    errorTitle.classList.add('error__title');
    errorText.classList.add('error__text');

    errorTitle.textContent = this.errorTitle;
    errorText.textContent = 'Something went wrong. Please, refresh the page';
    wrapper.append(errorTitle, errorText);
    this.container.appendChild(wrapper);

    return this.container;
  }
}
