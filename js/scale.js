const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;

const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');
const scaleValue = document.querySelector('.scale__control--value');
const previewImage = document.querySelector('.img-upload__preview img');

const setScale = (value) => {
  scaleValue.value = `${value}%`;
  previewImage.style.transform = `scale(${value / 100})`;
};

const resetScale = () => setScale(MAX_SCALE);

const onSmallerClick = () => {
  let currentScale = parseInt(scaleValue.value, 10);
  if (currentScale > MIN_SCALE) {
    currentScale -= SCALE_STEP;
    setScale(currentScale);
  }
};

const onBiggerClick = () => {
  let currentScale = parseInt(scaleValue.value, 10);
  if (currentScale < MAX_SCALE) {
    currentScale += SCALE_STEP;
    setScale(currentScale);
  }
};

const initScale = () => {
  smallerButton.addEventListener('click', onSmallerClick);
  biggerButton.addEventListener('click', onBiggerClick);
  resetScale();
};

export { initScale, resetScale };
