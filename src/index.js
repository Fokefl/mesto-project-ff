import { createCard } from "./components/cards.js";
import { openModal, addCloseListeners, closeModal } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import { getUserInfo, getInitialCards, updateProfile, addNewCard, deleteCard, likeCard, unlikeCard, updateAvatar } from "./components/api.js";
import "./index.css";

// Настройки валидации
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// ID текущего пользователя
let currentUserId = null;

// DOM-элементы
const placesList = document.querySelector(".places__list");
const profileEditButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileImg = document.querySelector(".profile__image");
const avatarContainer = document.querySelector(".profile__image-container");

// Попапы
const profilePopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const deletePopup = document.querySelector(".popup_type_delete");
const avatarPopup = document.querySelector(".popup_type_avatar");

// Элементы попапа картинки
const imagePopupImage = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");

// Кнопка подтверждения удаления
const deleteConfirmButton = deletePopup.querySelector(".popup__button_confirm");

// Формы
const profileForm = profilePopup.querySelector(".popup__form");
const newCardForm = document.forms["new-place"];
const avatarForm = document.forms["change-avatar"];

// Поля формы профиля
const nameInput = profileForm.querySelector(".popup__input_type_name");
const jobInput = profileForm.querySelector(".popup__input_type_description");

// Переменные для удаления
let cardToDelete = null;
let cardElementToDelete = null;

// ─── Попап картинки ───────────────────────────────────────────────────────────

function openImagePopup(name, link) {
  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;
  openModal(imagePopup);
}

// ─── Слушатели закрытия всех попапов ─────────────────────────────────────────

addCloseListeners();

// ─── Редактирование профиля ───────────────────────────────────────────────────

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = profileForm.querySelector(".popup__button");

  submitButton.textContent = "Сохранение...";
  submitButton.disabled = true;

  updateProfile(nameInput.value, jobInput.value)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(profilePopup);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении профиля:", err);
    })
    .finally(() => {
      submitButton.textContent = "Сохранить";
      submitButton.disabled = false;
    });
}

profileForm.addEventListener("submit", handleProfileFormSubmit);

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(profilePopup);
});

// ─── Добавление карточки ──────────────────────────────────────────────────────

function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const name = newCardForm.elements.name.value.trim();
  const link = newCardForm.elements.link.value.trim();
  const submitButton = newCardForm.querySelector(".popup__button");

  submitButton.textContent = "Сохранение...";
  submitButton.disabled = true;

  addNewCard(name, link)
    .then((cardData) => {
      const cardElement = createCard(cardData, currentUserId, handleLikeClick, handleDeleteCard, openImagePopup);
      placesList.prepend(cardElement);
      newCardForm.reset();
      closeModal(newCardPopup);
    })
    .catch((err) => {
      console.error("Ошибка при добавлении карточки:", err);
    })
    .finally(() => {
      submitButton.textContent = "Создать";
      submitButton.disabled = false;
    });
}

newCardForm.addEventListener("submit", handleNewCardSubmit);

addCardButton.addEventListener("click", () => {
  newCardForm.reset();
  clearValidation(newCardForm, validationConfig);
  openModal(newCardPopup);
});

// ─── Аватар ───────────────────────────────────────────────────────────────────

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const avatarUrl = avatarForm.elements.link.value.trim();
  const submitButton = avatarForm.querySelector(".popup__button");

  submitButton.textContent = "Сохранение...";
  submitButton.disabled = true;

  updateAvatar(avatarUrl)
    .then((userData) => {
      profileImg.src = userData.avatar;
      closeModal(avatarPopup);
      avatarForm.reset();
    })
    .catch((err) => {
      console.error("Ошибка обновления аватара:", err);
    })
    .finally(() => {
      submitButton.textContent = "Сохранить";
      submitButton.disabled = false;
    });
}

avatarForm.addEventListener("submit", handleAvatarFormSubmit);

avatarContainer.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});

// ─── Удаление с подтверждением ────────────────────────────────────────────────

function handleDeleteCard(cardId, cardElement) {
  cardToDelete = cardId;
  cardElementToDelete = cardElement;
  openModal(deletePopup);
}

deleteConfirmButton.addEventListener("click", () => {
  if (!cardToDelete) return;

  deleteConfirmButton.textContent = "Удаление...";
  deleteConfirmButton.disabled = true;

  deleteCard(cardToDelete)
    .then(() => {
      cardElementToDelete.remove();
      closeModal(deletePopup);
      cardToDelete = null;
      cardElementToDelete = null;
    })
    .catch((err) => {
      console.error("Ошибка при удалении карточки:", err);
    })
    .finally(() => {
      deleteConfirmButton.textContent = "Да";
      deleteConfirmButton.disabled = false;
    });
});

// ─── Лайки ────────────────────────────────────────────────────────────────────

function handleLikeClick(cardId, likeButton, likeCount) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  const likeMethod = isLiked ? unlikeCard : likeCard;

  likeMethod(cardId)
    .then((updatedCard) => {
      likeCount.textContent = updatedCard.likes.length;
      likeButton.classList.toggle("card__like-button_is-active");
    })
    .catch((err) => {
      console.error("Ошибка при лайке:", err);
    });
}

// ─── Инициализация ────────────────────────────────────────────────────────────

enableValidation(validationConfig);

Promise.all([getInitialCards(), getUserInfo()])
  .then(([cardsData, userData]) => {
    currentUserId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImg.src = userData.avatar;

    cardsData.forEach((cardData) => {
      const cardElement = createCard(cardData, currentUserId, handleLikeClick, handleDeleteCard, openImagePopup);
      placesList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error("Ошибка при загрузке данных:", err);
  });
