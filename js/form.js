import { initEffects } from './effects.js';

const uploadInput = document.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('#upload-cancel');
const preview = document.querySelector('.img-upload__preview img');

const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const scaleValueInput = document.querySelector('.scale__control--value');

const MIN_SCALE = 25;
const MAX_SCALE = 100;
const SCALE_STEP = 25;
let currentScale = 100;

const effectRadios = document.querySelectorAll('.effects__radio');
const sliderElement = document.querySelector('.effect-level__slider');
const effectValueInput = document.querySelector('.effect-level__value');

const EFFECTS = {
  none: { filter: '', unit: '', min: 0, max: 100, step: 1 },
  chrome: { filter: 'grayscale', unit: '', min: 0, max: 1, step: 0.1 },
  sepia: { filter: 'sepia', unit: '', min: 0, max: 1, step: 0.1 },
  marvin: { filter: 'invert', unit: '%', min: 0, max: 100, step: 1 },
  phobos: { filter: 'blur', unit: 'px', min: 0, max: 3, step: 0.1 },
  heat: { filter: 'brightness', unit: '', min: 1, max: 3, step: 0.1 }
};

let currentEffect = 'none';

function applyScale() {
  preview.style.transform = `scale(${currentScale / 100})`;
  scaleValueInput.value = `${currentScale}%`;
}

function resetScale() {
  currentScale = 100;
  applyScale();
}

scaleSmaller.addEventListener('click', () => {
  currentScale = Math.max(MIN_SCALE, currentScale - SCALE_STEP);
  applyScale();
});

scaleBigger.addEventListener('click', () => {
  currentScale = Math.min(MAX_SCALE, currentScale + SCALE_STEP);
  applyScale();
});

noUiSlider.create(sliderElement, {
  range: { min: 0, max: 100 },
  start: 100,
  step: 1,
  connect: 'lower',
});

sliderElement.noUiSlider.on('update', () => {
  const value = sliderElement.noUiSlider.get();
  effectValueInput.value = value;

  const effect = EFFECTS[currentEffect];

  if (currentEffect === 'none') {
    preview.style.filter = '';
  } else {
    preview.style.filter = `${effect.filter}(${value}${effect.unit})`;
  }
});

effectRadios.forEach((radio) => {
  radio.addEventListener('change', () => {
    currentEffect = radio.value;

    const effect = EFFECTS[currentEffect];

    sliderElement.noUiSlider.updateOptions({
      range: { min: effect.min, max: effect.max },
      start: effect.max,
      step: effect.step
    });

    if (currentEffect === 'none') {
      preview.style.filter = '';
    }
  });
});

uploadInput.addEventListener('change', () => {
  const file = uploadInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
  }

  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');

  resetScale();
  sliderElement.noUiSlider.set(EFFECTS[currentEffect].max);
});

closeButton.addEventListener('click', closeEditor);

function closeEditor() {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  uploadInput.value = '';
  resetScale();
}

export function initForm() {}
