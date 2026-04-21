// Создание карточки
export function createCard(cardData, userId, handleLike, handleDelete, openImagePopup) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const deleteButton = cardElement.querySelector(".card__delete-button");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");

  // Кнопку удаления показываем только на своих карточках
  if (cardData.owner._id !== userId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => handleDelete(cardData._id, cardElement));
  }

  // Заполняем карточку данными
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  // Если пользователь уже лайкнул — ставим активный класс
  if (cardData.likes.some((like) => like._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  likeButton.addEventListener("click", () => handleLike(cardData._id, likeButton, likeCount));
  cardImage.addEventListener("click", () => openImagePopup(cardData.name, cardData.link));

  return cardElement;
}

// Переключить состояние лайка и счётчик
export function updateCardLike(likeButton, likeCount, likesArray) {
  likeCount.textContent = likesArray.length;
  likeButton.classList.toggle("card__like-button_is-active");
}

// Удалить карточку из DOM
export function removeCard(cardElement) {
  cardElement.remove();
}
