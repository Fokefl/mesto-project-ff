// Включить валидацию для всех форм на странице
export function enableValidation(settings) {
  const forms = document.querySelectorAll(settings.formSelector);
  forms.forEach((form) => {
    setupFormValidation(form, settings);
  });
}

// Очистить ошибки валидации и заблокировать кнопку
export function clearValidation(form, settings) {
  const inputs = form.querySelectorAll(settings.inputSelector);
  const submitButton = form.querySelector(settings.submitButtonSelector);

  inputs.forEach((input) => {
    const errorElement = form.querySelector(`#${input.id}-error`);
    hideInputError(input, errorElement, settings);
  });

  submitButton.disabled = true;
  submitButton.classList.add(settings.inactiveButtonClass);
}

// Настройка валидации одной формы
function setupFormValidation(form, settings) {
  const inputs = form.querySelectorAll(settings.inputSelector);
  const submitButton = form.querySelector(settings.submitButtonSelector);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      validateInput(input, form, settings);
      toggleButtonState(inputs, submitButton, settings.inactiveButtonClass);
    });
  });
}

// Проверить одно поле
function validateInput(input, form, settings) {
  const errorElement = form.querySelector(`#${input.id}-error`);

  if (!input.validity.valid) {
    showInputError(input, errorElement, settings);
  } else {
    hideInputError(input, errorElement, settings);
  }
}

// Показать ошибку под полем
function showInputError(input, errorElement, settings) {
  if (!errorElement) return;

  input.classList.add(settings.inputErrorClass);

  if (input.validity.valueMissing) {
    errorElement.textContent = "Вы пропустили это поле.";
  } else if (input.validity.tooShort) {
    errorElement.textContent = `Минимальное количество символов: ${input.minLength}. Длина текста сейчас: ${input.value.length} символ.`;
  } else if (input.validity.patternMismatch) {
    errorElement.textContent = input.dataset.errorMessage || "Недопустимые символы";
  } else if (input.validity.typeMismatch) {
    errorElement.textContent = "Укажите корректный адрес страницы в интернете";
  } else {
    errorElement.textContent = input.validationMessage;
  }

  errorElement.classList.add(settings.errorClass);
}

// Скрыть ошибку под полем
function hideInputError(input, errorElement, settings) {
  if (!errorElement) return;

  input.classList.remove(settings.inputErrorClass);
  errorElement.classList.remove(settings.errorClass);
  errorElement.textContent = "";
}

// Переключить состояние кнопки отправки
function toggleButtonState(inputs, button, inactiveClass) {
  const isValid = Array.from(inputs).every((input) => input.validity.valid);
  button.disabled = !isValid;
  button.classList.toggle(inactiveClass, !isValid);
}
