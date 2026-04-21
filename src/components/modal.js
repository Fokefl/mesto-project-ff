// Добавляем класс анимации всем попапам один раз при загрузке страницы
document.querySelectorAll(".popup").forEach((popup) => {
  popup.classList.add("popup_is-animated");
});

// Открыть попап
export function openModal(popup) {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", handleEscKeydown);
}

// Закрыть попап
export function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", handleEscKeydown);
}

// Навесить слушатели закрытия на все попапы
export function addCloseListeners() {
  document.querySelectorAll(".popup").forEach((popup) => {
    popup.addEventListener("click", (evt) => {
      if (evt.target === popup) closeModal(popup);
    });

    popup.querySelector(".popup__close").addEventListener("click", () => {
      closeModal(popup);
    });
  });
}

// Закрытие по Escape
function handleEscKeydown(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) closeModal(openedPopup);
  }
}
