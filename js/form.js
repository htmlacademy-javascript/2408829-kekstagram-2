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

const pristine = new Pristine(FORM, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'form__error',
});

const submitButtonText = SUBMIT_BUTTON.textContent;

const blockSubmitButton = () => {
  SUBMIT_BUTTON.disabled = true;
  SUBMIT_BUTTON.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  SUBMIT_BUTTON.disabled = false;
  SUBMIT_BUTTON.textContent = submitButtonText;
};

const closeSuccess = (element, onEsc, onClickOutside) => {
  element.remove();
  document.removeEventListener('keydown', onEsc);
  document.removeEventListener('click', onClickOutside);
};

const closeError = (element, onEsc, onClickOutside) => {
  element.remove();
  document.removeEventListener('keydown', onEsc);
  document.removeEventListener('click', onClickOutside);
};

const showSuccessMessage = () => {
  const template = document.querySelector('#success').content.querySelector('.success');
  const element = template.cloneNode(true);
  const button = element.querySelector('.success__button');

  const onEsc = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeSuccess(element, onEsc, onClickOutside);
    }
  };

  const onClickOutside = (evt) => {
    if (!evt.target.closest('.success__inner')) {
      closeSuccess(element, onEsc, onClickOutside);
    }
  };

  button.addEventListener('click', () => {
    closeSuccess(element, onEsc, onClickOutside);
  });

  document.body.append(element);
  document.addEventListener('keydown', onEsc);
  document.addEventListener('click', onClickOutside);
};

const showErrorMessage = () => {
  const template = document.querySelector('#error').content.querySelector('.error');
  const element = template.cloneNode(true);
  const button = element.querySelector('.error__button');

  const onEsc = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeError(element, onEsc, onClickOutside);
    }
  };

  const onClickOutside = (evt) => {
    if (!evt.target.closest('.error__inner')) {
      closeError(element, onEsc, onClickOutside);
    }
  };

  button.addEventListener('click', () => {
    closeError(element, onEsc, onClickOutside);
  });

  document.body.append(element);
  document.addEventListener('keydown', onEsc);
  document.addEventListener('click', onClickOutside);
};

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
  const isMessage =
    document.querySelector('.success') || document.querySelector('.error');

  if (evt.key === 'Escape' && !isMessage) {
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

const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;

const getHashtags = (value) => {
  if (!value.trim()) {
    return [];
  }
  return value.trim().toLowerCase().split(/\s+/);
};

const isHashtagCountValid = (value) => {
  const hashtags = getHashtags(value);
  return hashtags.length <= 5;
};

const isHashtagFormatValid = (value) => {
  const hashtags = getHashtags(value);
  return hashtags.every((tag) => HASHTAG_REGEX.test(tag));
};

const isHashtagUnique = (value) => {
  const hashtags = getHashtags(value);
  const unique = new Set(hashtags);
  return unique.size === hashtags.length;
};

const isCommentValid = (value) => value.length <= 140;

pristine.addValidator(HASHTAGS_INPUT, isHashtagCountValid, 'Не более 5 хэштегов', 1, true);
pristine.addValidator(HASHTAGS_INPUT, isHashtagFormatValid, 'Неверный формат хэштега', 2, true);
pristine.addValidator(HASHTAGS_INPUT, isHashtagUnique, 'Хэштеги не должны повторяться', 3, true);
pristine.addValidator(DESCRIPTION_INPUT, isCommentValid, 'Комментарий не должен превышать 140 символов');

FORM.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (!isValid) {
    return;
  }

  blockSubmitButton();

  const formData = new FormData(FORM);

  sendData(formData)
    .then((response) => {
      if (!response.ok) {
        throw new Error();
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
