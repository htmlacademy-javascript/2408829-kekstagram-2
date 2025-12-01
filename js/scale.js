const MIN_SCALE = 25;
const MAX_SCALE = 100;
const SCALE_STEP = 25;

const preview = document.querySelector('.img-upload__preview img');
const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');
const scaleValue = document.querySelector('.scale__control--value');

let currentScale = 100;

const applyScale = () => {
  preview.style.transform = `scale(${currentScale / 100})`;
  scaleValue.value = `${currentScale}%`;
};

export const resetScale = () => {
  currentScale = 100;
  applyScale();
};

export const initScale = () => {
  applyScale();

  smallerButton.addEventListener('click', () => {
    currentScale = Math.max(MIN_SCALE, currentScale - SCALE_STEP);
    applyScale();
  });

  biggerButton.addEventListener('click', () => {
    currentScale = Math.min(MAX_SCALE, currentScale + SCALE_STEP);
    applyScale();
  });
};
