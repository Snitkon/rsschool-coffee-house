export class Spinner {
  createSpinner() {
    const spinner = document.createElement('div');

    spinner.classList.add('loader');
    return spinner;
  }
}
