import { sendData } from './api.js';

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
};

const closeForm = () => {
  OVERLAY.classList.add('hidden');
  document.body.classList.remove('modal-open');
  FORM.reset();
  pristine.reset();
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeForm();
    document.removeEventListener('keydown', onDocumentKeydown);
  }
};

FILE_INPUT.addEventListener('change', () => {
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
  if (hashtags.length > 5) return false;
  const uniqueTags = new Set(hashtags);
  if (uniqueTags.size !== hashtags.length) return false;
  return hashtags.every((tag) => hashtagPattern.test(tag));
};

const validateComment = (value) => value.length <= 140;

pristine.addValidator(HASHTAGS_INPUT, validateHashtags, 'Не более 5 хэштегов, без повторов, от # и без спецсимволов');
pristine.addValidator(DESCRIPTION_INPUT, validateComment, 'Комментарий не должен превышать 140 символов');

FORM.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    const formData = new FormData(FORM);

    sendData(formData)
      .then(() => {
        closeForm();
        alert('Форма успешно отправлена!');
      })
      .catch(() => {
        alert('Ошибка при отправке формы. Попробуйте снова.');
      });
  }
});
