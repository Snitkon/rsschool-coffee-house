import { SignUpForm } from './auth/signUpForm';

export function signUp() {
  const root = document.querySelector<HTMLElement>('.signup');

  if (!root) {
    console.error('Not found root!');
    return;
  }

  new SignUpForm(root);
}
