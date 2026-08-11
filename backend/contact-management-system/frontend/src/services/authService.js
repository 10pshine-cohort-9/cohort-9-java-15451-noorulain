import axiosClient from "./axiosClient";

export async function login({ email, password }) {
  const response = await axiosClient.post("/api/auth/login", {
    identifier: email,
    password,
  });

  const data = response.data;

  const token =
    data?.data?.token ||
    data?.token ||
    data?.data?.accessToken ||
    data?.accessToken ||
    data?.data?.jwt ||
    data?.jwt ||
    data?.data?.access_token ||
    data?.access_token;

  if (!token) {
    throw new Error("Login succeeded but no JWT token was returned.");
  }

  const user = data?.data?.user || data?.user || data?.data || { email };

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
}

export async function register({
  firstName,
  lastName,
  email,
  password,
  phone,
}) {
  const response = await axiosClient.post("/api/auth/register", {
    firstName,
    lastName,
    email,
    password,
    phone,
  });

  return response.data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}