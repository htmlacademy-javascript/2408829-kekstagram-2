import { resetScale } from './scale.js';

const EFFECTS = {
  chrome: {
    filter: 'grayscale',
    unit: '',
    range: { min: 0, max: 1, step: 0.1 }
  },
  sepia: {
    filter: 'sepia',
    unit: '',
    range: { min: 0, max: 1, step: 0.1 }
  },
  marvin: {
    filter: 'invert',
    unit: '%',
    range: { min: 0, max: 100, step: 1 }
  },
  phobos: {
    filter: 'blur',
    unit: 'px',
    range: { min: 0, max: 3, step: 0.1 }
  },
  heat: {
    filter: 'brightness',
    unit: '',
    range: { min: 1, max: 3, step: 0.1 }
  },
  none: {
    filter: 'none'
  }
};

const previewImage = document.querySelector('.img-upload__preview img');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectValueInput = document.querySelector('.effect-level__value');
const effectsList = document.querySelector('.effects__list');

let currentEffect = 'none';

const applyEffect = (effect, value) => {
  if (effect === 'none') {
    previewImage.style.filter = '';
    effectValueInput.value = '';
    return;
  }

  const { filter, unit } = EFFECTS[effect];
  previewImage.style.filter = `${filter}(${value}${unit})`;
  effectValueInput.value = value;
};

const updateSlider = (effect) => {
  if (effect === 'none') {
    effectLevelSlider.classList.add('hidden');
    return;
  }

  const { range } = EFFECTS[effect];
  effectLevelSlider.classList.remove('hidden');

  noUiSlider.create(effectLevelSlider, {
    range: { min: range.min, max: range.max },
    start: range.max,
    step: range.step,
    connect: 'lower',
    format: {
      to: (value) => parseFloat(value).toFixed(1),
      from: (value) => parseFloat(value)
    }
  });

  effectLevelSlider.noUiSlider.on('update', () => {
    const value = effectLevelSlider.noUiSlider.get();
    applyEffect(effect, value);
  });
};

const resetSlider = () => {
  if (effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.destroy();
  }
};

const onEffectChange = (evt) => {
  if (!evt.target.matches('input[name="effect"]')) return;

  currentEffect = evt.target.value;
  resetSlider();
  updateSlider(currentEffect);
  resetScale();
};

const initEffects = () => {
  effectsList.addEventListener('change', onEffectChange);
  updateSlider('none');
};

const resetEffects = () => {
  currentEffect = 'none';
  resetSlider();
  updateSlider(currentEffect);
};

export { initEffects, resetEffects };
