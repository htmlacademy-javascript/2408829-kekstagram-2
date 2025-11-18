import { isEscapeKey } from './utilities.js';
import { initEffects, resetEffects } from './effects.js';
import { sendData } from './data.js';

const form = document.querySelector('.img-upload__form');
const uploadInput = document.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const body = document.body;

const scaleSmaller = form.querySelector('.scale__control--smaller');
const scaleBigger = form.querySelector('.scale__control--bigger');
const scaleValue = form.querySelector('.scale__control--value');
const previewImage = form.querySelector('.img-upload__preview img');

const Scale = {
  MIN: 25,
  MAX: 100,
  STEP: 25
};

let currentScale = Scale.MAX;

const applyScale = (value) => {
  previewImage.style.transform = `scale(${value / 100})`;
  scaleValue.value = `${value}%`;
};

const resetScale = () => {
  currentScale = Scale.MAX;
  applyScale(currentScale);
};

const onScaleSmallerClick = () => {
  if (currentScale > Scale.MIN) {
    currentScale -= Scale.STEP;
    applyScale(currentScale);
  }
};

const onScaleBiggerClick = () => {
  if (currentScale < Scale.MAX) {
    currentScale += Scale.STEP;
    applyScale(currentScale);
  }
};

const onCancelClick = () => {
  closeForm();
};

const onEscKeyDown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeForm();
  }
};

const removeEventListeners = () => {
  document.removeEventListener('keydown', onEscKeyDown);
  cancelButton.removeEventListener('click', onCancelClick);
  scaleSmaller.removeEventListener('click', onScaleSmallerClick);
  scaleBigger.removeEventListener('click', onScaleBiggerClick);
};

const openForm = () => {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');

  resetScale();
  resetEffects();

  document.addEventListener('keydown', onEscKeyDown);
  cancelButton.addEventListener('click', onCancelClick);
  scaleSmaller.addEventListener('click', onScaleSmallerClick);
  scaleBigger.addEventListener('click', onScaleBiggerClick);
};

const closeForm = () => {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  form.reset();
  removeEventListeners();
};

uploadInput.addEventListener('change', () => {
  openForm();
});

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const formData = new FormData(form);
  sendData(formData)
    .then(() => {
      closeForm();
    })
    .catch(() => {
      alert('Ошибка при отправке формы');
    });
});

initEffects();
