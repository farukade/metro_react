import axios from "axios";
import {
  LoginResponse,
  TransactionModel,
  TransactionResponse,
  TransactionsResponse,
  UserModel,
} from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
export const LOGIN_URL = `${API_URL}/user/login`;
export const REGISTER_URL = `${API_URL}/user/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;
export const TRANSACTION_URL = `${API_URL}/transaction`;
export const USER_URL = `${API_URL}/user`;

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post<LoginResponse>(LOGIN_URL, {
    email,
    password,
  });
}

// Server should return AuthModel
export function postTransaction(
  data: TransactionModel,
  user: UserModel | undefined
) {
  return axios.post<TransactionResponse>(TRANSACTION_URL, data, {
    headers: {
      Authorization: `Bearer ${user?.token}`,
      Accept: "application/json",
    },
  });
}

export function updateUserItem(data: any, user: UserModel | undefined) {
  return axios.put<LoginResponse>(`${USER_URL}/${user?.id}`, data, {
    headers: {
      Authorization: `Bearer ${user?.token}`,
      Accept: "application/json",
    },
  });
}

// Server should return AuthModel
export function fetchTransaction(
  user: UserModel | undefined,
  meta: { page: number; limit: number }
) {
  const { page, limit } = meta;
  return axios.get<TransactionsResponse>(
    `${TRANSACTION_URL}?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${user?.token}`,
        Accept: "application/json",
      },
    }
  );
}

// Server should return AuthModel
export function removeTransaction(user: UserModel | undefined, id: number) {
  return axios.delete<TransactionResponse>(`${TRANSACTION_URL}?id=${id}`, {
    headers: {
      Authorization: `Bearer ${user?.token}`,
      Accept: "application/json",
    },
  });
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    firstName: firstname,
    lastName: lastname,
    password,
    passwordConfirmation: password_confirmation,
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  });
}
