import { sendData } from './data.js';

const form = document.querySelector('#upload-select-image');
const overlay = form.querySelector('.img-upload__overlay');
const fileField = form.querySelector('#upload-file');
const cancelButton = form.querySelector('#upload-cancel');
const submitButton = form.querySelector('#upload-submit');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error-text',
});

const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

const showMessage = (template) => {
  const messageElement = template.cloneNode(true);
  document.body.appendChild(messageElement);

  const button = messageElement.querySelector('button');

  const closeMessage = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onEscKeyDown);
  };

  function onEscKeyDown(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeMessage();
    }
  }

  button.addEventListener('click', closeMessage);
  document.addEventListener('keydown', onEscKeyDown);
};

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const closeForm = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  form.reset();
  pristine.reset();
};

fileField.addEventListener('change', () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
});

cancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeForm();
});

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (!isValid) {
    return;
  }

  const formData = new FormData(evt.target);

  blockSubmitButton();
  sendData(formData)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка отправки данных');
      }
      closeForm();
      showMessage(successTemplate);
    })
    .catch(() => {
      showMessage(errorTemplate);
    })
    .finally(unblockSubmitButton);
});

const initForm = () => {};

export { initForm };
