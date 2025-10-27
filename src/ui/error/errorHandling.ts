import { TResponseApi } from '../../types/types';
import { isErrorResponse, isSuccessResponse, isTestErrorResponse } from '../helper/typeGuards';
import { ErrorBoundary } from './errorBoundary';

export class ErrorHandling<T> {
  private container: HTMLElement;
  private mainContainer?: HTMLElement;
  private data: TResponseApi<T>;
  private renderFn: (data: T) => void;
  private destroyFn?: () => void;
  private isErrorText?: string;

  constructor({
    container,
    mainContainer,
    data,
    renderFn,
    destroyFn,
    isErrorText = '',
  }: {
    container: HTMLElement | null;
    mainContainer?: HTMLElement;
    data: TResponseApi<T>;
    renderFn: (data: T) => void;
    destroyFn?: () => void;
    isErrorText: string;
  }) {
    if (!container) {
      throw new Error('Container not found!');
    }
    this.container = container;
    this.mainContainer = mainContainer;
    this.data = data;
    this.renderFn = renderFn;
    this.destroyFn = destroyFn;
    this.isErrorText = isErrorText;
  }

  private createErrorBoundary(title: string, isErrorText: string) {
    return new ErrorBoundary({ errorTitle: title, isErrorText: isErrorText });
  }

  render() {
    try {
      this.container.innerHTML = '';

      if (isTestErrorResponse(this.data)) {
        if (this.destroyFn) {
          this.destroyFn();
        }
        const err = this.data;
        const title = err.isTestError ? 'This Test Error' : 'This Test Error';
        const errorBoundary = this.createErrorBoundary(title, this.isErrorText!);
        if (this.mainContainer) {
          this.mainContainer.appendChild(errorBoundary.renderErrorBounder());
        } else {
          this.container.appendChild(errorBoundary.renderErrorBounder());
        }
        return;
      }

      if (isErrorResponse(this.data)) {
        if (this.destroyFn) {
          this.destroyFn();
        }
        const err = this.data;
        const title = err.message ? err.message : err.error;
        const errorBoundary = this.createErrorBoundary(title, this.isErrorText!);
        if (this.mainContainer) {
          this.mainContainer.appendChild(errorBoundary.renderErrorBounder());
        } else {
          this.container.appendChild(errorBoundary.renderErrorBounder());
        }
        return;
      }
      if (isSuccessResponse(this.data)) {
        this.renderFn(this.data.data);
        return;
      }
      throw new Error('Unknown error');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error: Unknown error';
      console.error(message);
      this.container.innerHTML = `<div>${message}</div>`;
    }
  }
}
