import axiosClient from "./axiosClient";

const BASE_URL = "/api/contacts";

export async function getContacts() {
  const response = await axiosClient.get(BASE_URL);
  return response.data;
}

export async function getContact(id) {
  const response = await axiosClient.get(`${BASE_URL}/${id}`);
  return response.data;
}

export async function createContact(contact) {
  const response = await axiosClient.post(BASE_URL, contact);
  return response.data;
}

export async function updateContact(id, contact) {
  const response = await axiosClient.put(`${BASE_URL}/${id}`, contact);
  return response.data;
}

export async function deleteContact(id) {
  const response = await axiosClient.delete(`${BASE_URL}/${id}`);
  return response.data;
}

export async function searchContacts(keyword) {
  const response = await axiosClient.get(`${BASE_URL}/search`, {
    params: {
      keyword,
    },
  });
  return response.data;
}