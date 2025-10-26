import { apiFetch } from '../apiFetch';
import { ILogInOrSignIn, ILogInRequest, IProfile, ISignUpRequest } from '../../types/types';

export async function signUp(data: ISignUpRequest) {
  const jsonData = JSON.stringify(data);
  const response = await apiFetch<ILogInOrSignIn>('/auth/register', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: jsonData,
  });

  return response;
}

export async function logIn(data: ILogInRequest) {
  const jsonData = JSON.stringify(data);
  const response = await apiFetch<ILogInOrSignIn>('/auth/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: jsonData,
  });

  return response;
}

export async function getProfile(token: string) {
  const response = await apiFetch<IProfile>('/auth/profile', {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}
