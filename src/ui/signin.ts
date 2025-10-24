import { SignInForm } from './auth/signInForm';

export function signIn() {
  const root = document.querySelector<HTMLElement>('.signin');

  if (!root) {
    console.error('Not found root!');
    return;
  }

  new SignInForm(root);
}
