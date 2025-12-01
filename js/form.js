import { initScale, resetScale } from './scale.js';
import { initEffects, resetEffects } from './effects.js';
import { sendData } from './data.js';

const fileInput = document.querySelector('.img-upload__input');
const form = document.querySelector('.img-upload__form');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = form.querySelector('.img-upload__cancel');
const hashtagsInput = form.querySelector('.text__hashtags');
const descriptionInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');
const previewImg = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

const submitButtonText = submitButton.textContent;

const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'form__error',
});

function getHashtags(value) {
  if (!value.trim()) {
    return [];
  }
  return value.trim().toLowerCase().split(/\s+/);
}

function isHashtagCountValid(value) {
  const hashtags = getHashtags(value);
  return hashtags.length <= 5;
}

function isHashtagFormatValid(value) {
  const hashtags = getHashtags(value);
  return hashtags.every((tag) => HASHTAG_REGEX.test(tag));
}

function isHashtagUnique(value) {
  const hashtags = getHashtags(value);
  const unique = new Set(hashtags);
  return unique.size === hashtags.length;
}

function isCommentValid(value) {
  return value.length <= 140;
}

pristine.addValidator(hashtagsInput, isHashtagCountValid, 'Не более 5 хэштегов', 1, true);
pristine.addValidator(hashtagsInput, isHashtagFormatValid, 'Неверный формат хэштега', 2, true);
pristine.addValidator(hashtagsInput, isHashtagUnique, 'Хэштеги не должны повторяться', 3, true);
pristine.addValidator(descriptionInput, isCommentValid, 'Комментарий не должен превышать 140 символов');

function blockSubmitButton() {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
}

function unblockSubmitButton() {
  submitButton.disabled = false;
  submitButton.textContent = submitButtonText;
}

function resetPreview() {
  previewImg.src = 'img/upload-default-image.jpg';
  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = '';
  });
}

function openForm() {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  resetScale();
  resetEffects();
}

function closeForm() {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  form.reset();
  pristine.reset();
  resetScale();
  resetEffects();
  resetPreview();
}

function isTextFieldFocused() {
  return document.activeElement === hashtagsInput || document.activeElement === descriptionInput;
}

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    const messageOpen = document.querySelector('.success') || document.querySelector('.error');

    if (messageOpen || isTextFieldFocused()) {
      return;
    }

    evt.preventDefault();
    closeForm();
    document.removeEventListener('keydown', onDocumentKeydown);
  }
}

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];

  if (!file) {
    return;
  }

  const fileUrl = URL.createObjectURL(file);
  previewImg.src = fileUrl;
  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = `url(${fileUrl})`;
  });

  openForm();
  document.addEventListener('keydown', onDocumentKeydown);
});

cancelButton.addEventListener('click', () => {
  closeForm();
  document.removeEventListener('keydown', onDocumentKeydown);
});

function showSuccessMessage() {
  const template = document.querySelector('#success').content.querySelector('.success');
  const element = template.cloneNode(true);
  const button = element.querySelector('.success__button');

  function closeSuccessMessage() {
    element.remove();
    document.removeEventListener('keydown', onSuccessKeydown);
    document.removeEventListener('click', onSuccessClickOutside);
  }

  function onSuccessKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeSuccessMessage();
    }
  }

  function onSuccessClickOutside(evt) {
    if (!evt.target.closest('.success__inner')) {
      closeSuccessMessage();
    }
  }

  button.addEventListener('click', () => {
    closeSuccessMessage();
  });

  document.body.append(element);
  document.addEventListener('keydown', onSuccessKeydown);
  document.addEventListener('click', onSuccessClickOutside);
}

function showErrorMessage() {
  const template = document.querySelector('#error').content.querySelector('.error');
  const element = template.cloneNode(true);
  const button = element.querySelector('.error__button');

  function closeErrorMessage() {
    element.remove();
    document.removeEventListener('keydown', onErrorKeydown);
    document.removeEventListener('click', onErrorClickOutside);
  }

  function onErrorKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeErrorMessage();
    }
  }

  function onErrorClickOutside(evt) {
    if (!evt.target.closest('.error__inner')) {
      closeErrorMessage();
    }
  }

  button.addEventListener('click', () => {
    closeErrorMessage();
  });

  document.body.append(element);
  document.addEventListener('keydown', onErrorKeydown);
  document.addEventListener('click', onErrorClickOutside);
}

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (!isValid) {
    return;
  }

  blockSubmitButton();

  const formData = new FormData(form);

  sendData(formData)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка отправки');
      }
      closeForm();
      document.removeEventListener('keydown', onDocumentKeydown);
      showSuccessMessage();
    })
    .catch(() => {
      showErrorMessage();
    })
    .finally(() => {
      unblockSubmitButton();
    });
});

initScale();
initEffects();
