import { sendData } from './data.js';

const form = document.querySelector('#upload-select-image');
const overlay = form.querySelector('.img-upload__overlay');
const fileField = form.querySelector('#upload-file');
const cancelButton = form.querySelector('#upload-cancel');
const submitButton = form.querySelector('#upload-submit');
const previewImage = form.querySelector('.img-upload__preview img');
const smallerButton = form.querySelector('.scale__control--smaller');
const biggerButton = form.querySelector('.scale__control--bigger');
const scaleValue = form.querySelector('.scale__control--value');

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
let currentScale = 100;

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error-text',
});

const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

const showMessage = (template) => {
  const element = template.cloneNode(true);
  document.body.appendChild(element);
  const button = element.querySelector('button');

  const closeMessage = () => {
    element.remove();
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
  previewImage.style.transform = '';
  fileField.value = '';
  removeFormListeners();
};

const onEscKeyDown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeForm();
  }
};

const openForm = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  addFormListeners();
};

const onCancelClick = (evt) => {
  evt.preventDefault();
  closeForm();
};

const onFormSubmit = (evt) => {
  evt.preventDefault();
  if (!pristine.validate()) {
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
};

const onScaleSmallerClick = () => {
  currentScale = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
  updateScale();
};

const onScaleBiggerClick = () => {
  currentScale = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
  updateScale();
};

const updateScale = () => {
  scaleValue.value = `${currentScale}%`;
  previewImage.style.transform = `scale(${currentScale / 100})`;
};

function addFormListeners() {
  document.addEventListener('keydown', onEscKeyDown);
  cancelButton.addEventListener('click', onCancelClick);
  form.addEventListener('submit', onFormSubmit);
  smallerButton.addEventListener('click', onScaleSmallerClick);
  biggerButton.addEventListener('click', onScaleBiggerClick);
}

function removeFormListeners() {
  document.removeEventListener('keydown', onEscKeyDown);
  cancelButton.removeEventListener('click', onCancelClick);
  form.removeEventListener('submit', onFormSubmit);
  smallerButton.removeEventListener('click', onScaleSmallerClick);
  biggerButton.removeEventListener('click', onScaleBiggerClick);
}

fileField.addEventListener('change', openForm);

export { openForm, closeForm, initForm };
function initForm() {}
