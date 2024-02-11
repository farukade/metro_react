import { ServerResponse, UserModel } from "./_models";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
export const LOGIN_URL = `${API_URL}/user/login`;
export const REGISTER_URL = `${API_URL}/user/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;
export const TRANSACTION_URL = `${API_URL}/transaction`;
export const USER_URL = `${API_URL}/user`;

// Server should return AuthModel
// export function login(email: string, password: string) {
//   return axios.post<LoginResponse>(LOGIN_URL, {
//     email,
//     password,
//   });
// }

// // Server should return AuthModel
// export function postTransaction(
//   data: TransactionModel,
//   user: UserModel | undefined
// ) {
//   return axios.post<TransactionResponse>(TRANSACTION_URL, data, {
//     headers: {
//       Authorization: `Bearer ${user?.token}`,
//       Accept: "application/json",
//     },
//   });
// }

// export function updateUserItem(data: any, user: UserModel | undefined) {
//   return axios.put<LoginResponse>(`${USER_URL}/${user?.id}`, data, {
//     headers: {
//       Authorization: `Bearer ${user?.token}`,
//       Accept: "application/json",
//     },
//   });
// }

// // Server should return AuthModel
// export function fetchTransaction(
//   user: UserModel | undefined,
//   meta: { page: number; limit: number }
// ) {
//   const { page, limit } = meta;
//   return axios.get<TransactionsResponse>(
//     `${TRANSACTION_URL}?page=${page}&limit=${limit}`,
//     {
//       headers: {
//         Authorization: `Bearer ${user?.token}`,
//         Accept: "application/json",
//       },
//     }
//   );
// }

// // Server should return AuthModel
// export function removeTransaction(user: UserModel | undefined, id: number) {
//   return axios.delete<TransactionResponse>(`${TRANSACTION_URL}?id=${id}`, {
//     headers: {
//       Authorization: `Bearer ${user?.token}`,
//       Accept: "application/json",
//     },
//   });
// }

// // Server should return AuthModel
// export function editTransaction(user: UserModel, item: TransactionModel) {
//   return axios.put<TransactionResponse>(`${TRANSACTION_URL}?id=${item.id}`, {
//     headers: {
//       Accept: "application/json",
//       Authorization: `Bearer ${user.token}`,
//     },
//   });
// }

// // Server should return AuthModel
// export function register(
//   email: string,
//   firstname: string,
//   lastname: string,
//   password: string,
//   password_confirmation: string
// ) {
//   return axios.post(REGISTER_URL, {
//     email,
//     firstName: firstname,
//     lastName: lastname,
//     password,
//     passwordConfirmation: password_confirmation,
//   });
// }

// // Server should return object => { result: boolean } (Is Email in DB)
// export function requestPassword(email: string) {
//   return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
//     email,
//   });
// }

export async function getUserByToken(token: string): Promise<UserModel | null> {
  const url = `user/by/token`;
  const { result } = await request(url, "POST", false, { token });
  return result;
}

export const defaultHeaders = {
  Accept: "application/json",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH",
  "Content-Type": "application/json",
};

export const defaultUploadHeaders = {
  Accept: "application/json",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH",
  "Content-Type": "multipart/form-data",
};

const parseJSON = (response: any) => response.json();

export const uploadRequest = async (url: string, method: string, body: any) => {
  let token = window ? localStorage.getItem("access_token") : "";

  if (!token) {
    token = "";
  }

  const jwt = `Bearer ${token}`;
  let headers = { ...defaultUploadHeaders, Authorization: jwt };
  const response = await axios.post(`${API_URL}/${url}`, body, { headers });
  // await fetch(`${API_URL}/${url}`, { method, headers, body });
  // const result = await checkStatus(response);
  // return parseJSON(result);
  return response;
};

export const request = async (
  url: string,
  method: string,
  authed = false,
  data: any = undefined
): Promise<ServerResponse> => {
  let token = window ? localStorage.getItem("access_token") : "";

  if (!token) {
    token = "";
  }

  const response = await fetch(`${API_URL}/${url}`, {
    method: method,
    headers: authed ? headers(token) : { ...defaultHeaders },
    body: data ? JSON.stringify(data) : undefined,
  });
  const result = await checkStatus(response);
  return parseJSON(result);
};

const headers = (token: string = "") => {
  if (token) {
    const jwt = `Bearer ${token}`;
    return { ...defaultHeaders, Authorization: jwt };
  } else {
    return defaultHeaders;
  }
};

const checkStatus = async (response: any) => {
  if (!response.ok) {
    if (response.statusText === "Unauthorized") {
      // prettier-ignore
      if (window) {
        localStorage.removeItem("access_token");
        window.location.reload();
      }
    }

    const message = await response.text();

    const err = JSON.parse(message);
    throw Object.freeze({ message: err.message || err.error });
  }

  return response;
};

export const getRandomNumber = (min: number, max: number) => {
  return Number((Math.random() * (max - min) + min).toFixed(0));
};

export const bootstrapColors = [
  "success",
  "danger",
  "primary",
  "info",
  "warning",
];
