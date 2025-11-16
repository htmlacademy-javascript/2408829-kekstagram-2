import { resetEffects, initEffects, destroySlider } from './effects.js';

const form = document.querySelector('.img-upload__form');
const overlay = form.querySelector('.img-upload__overlay');
const fileInput = form.querySelector('#upload-file');
const cancelButton = form.querySelector('#upload-cancel');
const scaleSmallerButton = form.querySelector('.scale__control--smaller');
const scaleBiggerButton = form.querySelector('.scale__control--bigger');
const scaleValue = form.querySelector('.scale__control--value');
const previewImage = form.querySelector('.img-upload__preview img');

let currentScale = 100;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const STEP_SCALE = 25;

const setScale = (value) => {
  currentScale = value;
  scaleValue.value = `${value}%`;
  previewImage.style.transform = `scale(${value / 100})`;
};

const scaleSmaller = () => {
  if (currentScale > MIN_SCALE) {
    setScale(currentScale - STEP_SCALE);
  }
};

const scaleBigger = () => {
  if (currentScale < MAX_SCALE) {
    setScale(currentScale + STEP_SCALE);
  }
};

const resetFormState = () => {
  form.reset();
  setScale(100);
  resetEffects();
  destroySlider();
};

const closeForm = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetFormState();
  removeEventListeners();
};

const onEscKeyDown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeForm();
  }
};

const onCancelClick = () => closeForm();

const addEventListeners = () => {
  document.addEventListener('keydown', onEscKeyDown);
  cancelButton.addEventListener('click', onCancelClick);
  scaleSmallerButton.addEventListener('click', scaleSmaller);
  scaleBiggerButton.addEventListener('click', scaleBigger);
};

const removeEventListeners = () => {
  document.removeEventListener('keydown', onEscKeyDown);
  cancelButton.removeEventListener('click', onCancelClick);
  scaleSmallerButton.removeEventListener('click', scaleSmaller);
  scaleBiggerButton.removeEventListener('click', scaleBigger);
};

fileInput.addEventListener('change', () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  setScale(100);
  initEffects();
  addEventListeners();
});

form.addEventListener('reset', () => {
  closeForm();
});
