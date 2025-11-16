import { initScale, resetScale } from './scale.js';
import { resetEffects } from './effects.js';
import { pristine } from './validation.js';
import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './message.js';

const uploadInput = document.querySelector('#upload-file');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('#upload-cancel');
const form = document.querySelector('.img-upload__form');

const openForm = () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  resetScale(); 
};

const closeForm = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  form.reset();
  pristine.reset();
  resetEffects();
  resetScale(); 
};

const onCancelClick = () => {
  closeForm();
};

const onFileInputChange = () => {
  openForm();
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) return;

  const formData = new FormData(form);

  sendData(formData)
    .then(() => {
      closeForm();
      showSuccessMessage();
    })
    .catch(() => {
      showErrorMessage();
    });
};

const initForm = () => {
  uploadInput.addEventListener('change', onFileInputChange);
  cancelButton.addEventListener('click', onCancelClick);
  form.addEventListener('submit', onFormSubmit);
  initScale();
};

export { initForm, closeForm };
