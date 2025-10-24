import { SignupForm } from './auth/signUp';

export function registration() {
  const root = document.querySelector<HTMLElement>('.registration');

  if (!root) {
    console.error('Not found root!');
    return;
  }

  new SignupForm(root);
}
