import { initScale, resetScale } from './scale.js';
import { initEffects, resetEffects } from './effects.js';
import { sendData } from './data.js';

const FILE_INPUT = document.querySelector('.img-upload__input');
const FORM = document.querySelector('.img-upload__form');
const OVERLAY = document.querySelector('.img-upload__overlay');
const CANCEL_BUTTON = FORM.querySelector('.img-upload__cancel');
const HASHTAGS_INPUT = FORM.querySelector('.text__hashtags');
const DESCRIPTION_INPUT = FORM.querySelector('.text__description');
const SUBMIT_BUTTON = FORM.querySelector('.img-upload__submit');
const PREVIEW_IMG = document.querySelector('.img-upload__preview img');
const EFFECT_PREVIEWS = document.querySelectorAll('.effects__preview');

const pristine = new Pristine(FORM, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'form__error',
});

const defaultSubmitText = SUBMIT_BUTTON.textContent;

function blockSubmit() {
  SUBMIT_BUTTON.disabled = true;
  SUBMIT_BUTTON.textContent = 'Публикую...';
}

function unblockSubmit() {
  SUBMIT_BUTTON.disabled = false;
  SUBMIT_BUTTON.textContent = defaultSubmitText;
}

function resetFileInput() {
  FILE_INPUT.value = '';
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
  resetFileInput();
  removeGlobalKeydown();
}

function onGlobalKeydown(evt) {
  if (evt.key === 'Escape') {
    const openPopup = document.querySelector('.success') || document.querySelector('.error');
    if (openPopup) {
      return;
    }
    if (document.activeElement === HASHTAGS_INPUT || document.activeElement === DESCRIPTION_INPUT) {
      return;
    }
    evt.preventDefault();
    closeForm();
  }
}

function addGlobalKeydown() {
  document.addEventListener('keydown', onGlobalKeydown);
}

function removeGlobalKeydown() {
  document.removeEventListener('keydown', onGlobalKeydown);
}

FILE_INPUT.addEventListener('change', () => {
  const file = FILE_INPUT.files[0];

  if (!file) {
    return;
  }

  const url = URL.createObjectURL(file);

  PREVIEW_IMG.src = url;
  EFFECT_PREVIEWS.forEach((preview) => {
    preview.style.backgroundImage = `url(${url})`;
  });

  openForm();
  addGlobalKeydown();
});

CANCEL_BUTTON.addEventListener('click', () => {
  closeForm();
});

const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

function parseHashtags(value) {
  return value.trim().toLowerCase().split(/\s+/).filter((t) => t.length > 0);
}

function validateCount(value) {
  return parseHashtags(value).length <= 5;
}

function validateFormat(value) {
  return parseHashtags(value).every((tag) => HASHTAG_REGEX.test(tag));
}

function validateUnique(value) {
  const tags = parseHashtags(value);
  return new Set(tags).size === tags.length;
}

function validateComment(value) {
  return value.length <= 140;
}

pristine.addValidator(HASHTAGS_INPUT, validateCount, 'Не более 5 хэштегов');
pristine.addValidator(HASHTAGS_INPUT, validateFormat, 'Неверный формат хэштега');
pristine.addValidator(HASHTAGS_INPUT, validateUnique, 'Хэштеги не должны повторяться');
pristine.addValidator(DESCRIPTION_INPUT, validateComment, 'Комментарий не должен превышать 140 символов');

function showSuccessMessage() {
  const template = document.querySelector('#success').content.querySelector('.success');
  const element = template.cloneNode(true);
  const button = element.querySelector('.success__button');

  function onEsc(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      close();
    }
  }

  function onClickOutside(evt) {
    if (!evt.target.closest('.success__inner')) {
      close();
    }
  }

  function close() {
    element.remove();
    document.removeEventListener('keydown', onEsc);
    document.removeEventListener('click', onClickOutside);
  }

  button.addEventListener('click', close);
  document.body.append(element);

  document.addEventListener('keydown', onEsc);
  document.addEventListener('click', onClickOutside);
}

function showErrorMessage() {
  const template = document.querySelector('#error').content.querySelector('.error');
  const element = template.cloneNode(true);
  const button = element.querySelector('.error__button');

  function onEsc(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      close();
    }
  }

  function onClickOutside(evt) {
    if (!evt.target.closest('.error__inner')) {
      close();
    }
  }

  function close() {
    element.remove();
    document.removeEventListener('keydown', onEsc);
    document.removeEventListener('click', onClickOutside);
  }

  button.addEventListener('click', close);
  document.body.append(element);

  document.addEventListener('keydown', onEsc);
  document.addEventListener('click', onClickOutside);
}

FORM.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  blockSubmit();

  const formData = new FormData(FORM);

  sendData(formData)
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      closeForm();
      showSuccessMessage();
    })
    .catch(() => {
      showErrorMessage();
    })
    .finally(() => {
      unblockSubmit();
    });
});

initScale();
initEffects();
