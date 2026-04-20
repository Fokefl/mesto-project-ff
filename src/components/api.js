const BASE_URL = "https://nomoreparties.co/v1/high-education-web-developer-magistr_4";
const TOKEN = "b08b0737-7a68-439b-912b-213f1d2e82c0";

const headers = {
  authorization: TOKEN,
  "Content-Type": "application/json",
};

function handleResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка сервера: ${res.status}`);
}

export const getUserInfo = () => {
  return fetch(`${BASE_URL}/users/me`, { headers }).then(handleResponse);
};

export const getInitialCards = () => {
  return fetch(`${BASE_URL}/cards`, { headers }).then(handleResponse);
};

export const updateProfile = (name, about) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ name, about }),
  }).then(handleResponse);
};

export const addNewCard = (name, link) => {
  return fetch(`${BASE_URL}/cards`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name, link }),
  }).then(handleResponse);
};

export const deleteCard = (cardId) => {
  return fetch(`${BASE_URL}/cards/${cardId}`, {
    method: "DELETE",
    headers,
  }).then(handleResponse);
};

export const likeCard = (cardId) => {
  return fetch(`${BASE_URL}/cards/${cardId}/likes`, {
    method: "PUT",
    headers,
  }).then(handleResponse);
};

export const unlikeCard = (cardId) => {
  return fetch(`${BASE_URL}/cards/${cardId}/likes`, {
    method: "DELETE",
    headers,
  }).then(handleResponse);
};

export const updateAvatar = (avatar) => {
  return fetch(`${BASE_URL}/users/me/avatar`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ avatar }),
  }).then(handleResponse);
};
