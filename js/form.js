import { initScale, resetScale } from './scale.js';
import { initEffects, resetEffects } from './effects.js';

const FILE_INPUT = document.querySelector('.img-upload__input');
const FORM = document.querySelector('.img-upload__form');
const OVERLAY = document.querySelector('.img-upload__overlay');
const CANCEL_BUTTON = FORM.querySelector('.img-upload__cancel');
const HASHTAGS_INPUT = FORM.querySelector('.text__hashtags');
const DESCRIPTION_INPUT = FORM.querySelector('.text__description');

const pristine = new Pristine(FORM, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'form__error',
});

const openForm = () => {
  OVERLAY.classList.remove('hidden');
  document.body.classList.add('modal-open');

  resetScale();
  resetEffects();
};

const closeForm = () => {
  OVERLAY.classList.add('hidden');
  document.body.classList.remove('modal-open');
  FORM.reset();
  pristine.reset();

  resetScale();
  resetEffects();
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeForm();
    document.removeEventListener('keydown', onDocumentKeydown);
  }
};

FILE_INPUT.addEventListener('change', () => {
  const file = FILE_INPUT.files[0];

  if (!file) {
    return;
  }

  const preview = document.querySelector('.img-upload__preview img');
  preview.src = URL.createObjectURL(file);

  openForm();
  document.addEventListener('keydown', onDocumentKeydown);
});

CANCEL_BUTTON.addEventListener('click', () => {
  closeForm();
  document.removeEventListener('keydown', onDocumentKeydown);
});

const validateHashtags = (value) => {
  if (!value.trim()) {
    return true;
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);
  const hashtagPattern = /^#[a-zа-яё0-9]{1,19}$/i;

  if (hashtags.length > 5) {
    return false;
  }

  const uniqueTags = new Set(hashtags);
  if (uniqueTags.size !== hashtags.length) {
    return false;
  }

  return hashtags.every((tag) => hashtagPattern.test(tag));
};

const validateComment = (value) => value.length <= 140;

pristine.addValidator(
  HASHTAGS_INPUT,
  validateHashtags,
  'Введите не более 5 хэштегов, начинающихся с #, без спецсимволов и повторов'
);
pristine.addValidator(
  DESCRIPTION_INPUT,
  validateComment,
  'Комментарий не должен превышать 140 символов'
);

FORM.addEventListener('submit', (evt) => {
  const isValid = pristine.validate();
  if (!isValid) {
    evt.preventDefault();
  }
});

const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

function validateHashtags(value) {
  if (!value.trim()) {
    return true;
  }

  const hashtags = value.trim().toLowerCase().split(/\s+/);

  if (hashtags.length > 5) {
    pristine.addError(HASHTAGS_INPUT, 'Не более 5 хэштегов');
    return false;
  }

  for (const tag of hashtags) {
    if (!HASHTAG_REGEX.test(tag)) {
      pristine.addError(HASHTAGS_INPUT, 'Неверный формат хэштега');
      return false;
    }
  }

  const unique = new Set(hashtags);
  if (unique.size !== hashtags.length) {
    pristine.addError(HASHTAGS_INPUT, 'Хэштеги не должны повторяться');
    return false;
  }

  return true;
}

function validateComment(value) {
  if (value.length > 140) {
    pristine.addError(DESCRIPTION_INPUT, 'Комментарий не должен превышать 140 символов');
    return false;
  }
  return true;
}

pristine.addValidator(HASHTAGS_INPUT, validateHashtags, '');
pristine.addValidator(DESCRIPTION_INPUT, validateComment, '');

initScale();
initEffects();
