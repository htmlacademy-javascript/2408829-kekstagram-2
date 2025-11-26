import { initScale, resetScale } from './scale.js';
import { initEffects, resetEffects } from './effects.js';
import { sendData } from './data.js';

const FILE_INPUT = document.querySelector('.img-upload__input');
const FORM = document.querySelector('.img-upload__form');
const OVERLAY = document.querySelector('.img-upload__overlay');
const CANCEL_BUTTON = FORM.querySelector('.img-upload__cancel');
const HASHTAGS_INPUT = FORM.querySelector('.text__hashtags');
const DESCRIPTION_INPUT = FORM.querySelector('.text__description');
const PREVIEW = document.querySelector('.img-upload__preview img');
const EFFECTS_PREVIEW = document.querySelectorAll('.effects__preview');

const SUBMIT_BUTTON = FORM.querySelector('.img-upload__submit');
const SUBMIT_TEXT = SUBMIT_BUTTON.textContent;

function blockSubmit() {
  SUBMIT_BUTTON.disabled = true;
  SUBMIT_BUTTON.textContent = 'Публикую...';
}

function unblockSubmit() {
  SUBMIT_BUTTON.disabled = false;
  SUBMIT_BUTTON.textContent = SUBMIT_TEXT;
}

function openForm() {
  OVERLAY.classList.remove('hidden');
  document.body.classList.add('modal-open');
  resetScale();
  resetEffects();
}

function closeForm() {
  OVERLAY.classList.add('hidden');
  document.body.classList.remove('modal-open');
  FORM.reset();
  pristine.reset();
  resetScale();
  resetEffects();
}

function onDocumentKeydown(evt) {
  const message = document.querySelector('.success') || document.querySelector('.error');
  if (message) return;

  if (evt.key === 'Escape' &&
      document.activeElement !== HASHTAGS_INPUT &&
      document.activeElement !== DESCRIPTION_INPUT) {
    evt.preventDefault();
    closeForm();
    document.removeEventListener('keydown', onDocumentKeydown);
  }
}

FILE_INPUT.addEventListener('change', () => {
  const file = FILE_INPUT.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  PREVIEW.src = url;

  EFFECTS_PREVIEW.forEach((item) => {
    item.style.backgroundImage = `url(${url})`;
  });

  openForm();
  document.addEventListener('keydown', onDocumentKeydown);
});

CANCEL_BUTTON.addEventListener('click', () => {
  closeForm();
  document.removeEventListener('keydown', onDocumentKeydown);
});

const pristine = new Pristine(FORM, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'form__error'
});

const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

function getHashtags(value) {
  return value.trim().toLowerCase() ? value.trim().toLowerCase().split(/\s+/) : [];
}

function isCountValid(value) {
  return getHashtags(value).length <= 5;
}

function isFormatValid(value) {
  return getHashtags(value).every((tag) => HASHTAG_REGEX.test(tag));
}

function isUnique(value) {
  const tags = getHashtags(value);
  return new Set(tags).size === tags.length;
}

function validateComment(value) {
  return value.length <= 140;
}

pristine.addValidator(HASHTAGS_INPUT, isCountValid, 'Не более 5 хэштегов', 1, true);
pristine.addValidator(HASHTAGS_INPUT, isFormatValid, 'Неверный формат хэштега', 2, true);
pristine.addValidator(HASHTAGS_INPUT, isUnique, 'Хэштеги не должны повторяться', 3, true);
pristine.addValidator(DESCRIPTION_INPUT, validateComment, 'Комментарий не должен превышать 140 символов');

function showSuccess() {
  const template = document.querySelector('#success').content.querySelector('.success');
  const element = template.cloneNode(true);

  function close() {
    element.remove();
    document.removeEventListener('keydown', onEsc);
    document.removeEventListener('click', onOutside);
  }

  function onEsc(evt) {
    if (evt.key === 'Escape') close();
  }

  function onOutside(evt) {
    if (!evt.target.closest('.success__inner')) close();
  }

  element.querySelector('.success__button').addEventListener('click', close);

  document.body.append(element);
  document.addEventListener('keydown', onEsc);
  document.addEventListener('click', onOutside);
}

function showError() {
  const template = document.querySelector('#error').content.querySelector('.error');
  const element = template.cloneNode(true);

  function close() {
    element.remove();
    document.removeEventListener('keydown', onEsc);
    document.removeEventListener('click', onOutside);
  }

  function onEsc(evt) {
    if (evt.key === 'Escape') close();
  }

  function onOutside(evt) {
    if (!evt.target.closest('.error__inner')) close();
  }

  element.querySelector('.error__button').addEventListener('click', close);

  document.body.append(element);
  document.addEventListener('keydown', onEsc);
  document.addEventListener('click', onOutside);
}

FORM.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) return;

  blockSubmit();

  const formData = new FormData(FORM);

  sendData(formData)
    .then(() => {
      closeForm();
      showSuccess();
    })
    .catch(() => {
      showError();
    })
    .finally(() => {
      unblockSubmit();
    });
});

initScale();
initEffects();
