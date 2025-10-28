import noUiSlider from '../vendor/nouislider/nouislider.js';

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;

const DEFAULT_EFFECT = 'none';

const scaleSmallerBtn = document.querySelector('.scale__control--smaller');
const scaleBiggerBtn = document.querySelector('.scale__control--bigger');
const scaleValueField = document.querySelector('.scale__control--value');

const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectValueField = document.querySelector('.effect-level__value');

const previewImage = document.querySelector('.img-upload__preview img');
const effectsList = document.querySelector('.effects__list');

let currentScale = SCALE_MAX;
let currentEffect = DEFAULT_EFFECT;

const EFFECTS = {
  none: {
    filter: '',
    range: null,
    step: null,
    unit: '',
  },
  chrome: {
    filter: 'grayscale',
    range: [0, 1],
    step: 0.1,
    unit: '',
  },
  sepia: {
    filter: 'sepia',
    range: [0, 1],
    step: 0.1,
    unit: '',
  },
  marvin: {
    filter: 'invert',
    range: [0, 100],
    step: 1,
    unit: '%',
  },
  phobos: {
    filter: 'blur',
    range: [0, 3],
    step: 0.1,
    unit: 'px',
  },
  heat: {
    filter: 'brightness',
    range: [1, 3],
    step: 0.1,
    unit: '',
  },
};

const updateScale = () => {
  scaleValueField.value = `${currentScale}%`;
  previewImage.style.transform = `scale(${currentScale / 100})`;
};

const onScaleSmallerClick = () => {
  if (currentScale > SCALE_MIN) {
    currentScale -= SCALE_STEP;
    updateScale();
  }
};

const onScaleBiggerClick = () => {
  if (currentScale < SCALE_MAX) {
    currentScale += SCALE_STEP;
    updateScale();
  }
};

const hideSlider = () => {
  effectLevelSlider.closest('.img-upload__effect-level').classList.add('hidden');
};

const showSlider = () => {
  effectLevelSlider.closest('.img-upload__effect-level').classList.remove('hidden');
};

const applyEffect = (value) => {
  const effect = EFFECTS[currentEffect];
  if (effect.filter) {
    previewImage.style.filter = `${effect.filter}(${value}${effect.unit})`;
  } else {
    previewImage.style.filter = 'none';
  }
  effectValueField.value = value;
};

const initSlider = () => {
  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1,
    connect: 'lower',
  });

  effectLevelSlider.noUiSlider.on('update', (_, __, value) => {
    applyEffect(value);
  });
};

const updateSlider = () => {
  const effect = EFFECTS[currentEffect];

  if (currentEffect === DEFAULT_EFFECT) {
    hideSlider();
    previewImage.style.filter = 'none';
    effectValueField.value = '';
    return;
  }

  showSlider();

  effectLevelSlider.noUiSlider.updateOptions({
    range: {
      min: effect.range[0],
      max: effect.range[1],
    },
    start: effect.range[1],
    step: effect.step,
  });

  applyEffect(effect.range[1]);
};

const onEffectChange = (evt) => {
  if (evt.target.name === 'effect') {
    currentEffect = evt.target.value;
    previewImage.className = ''; // сброс классов
    previewImage.classList.add(`effects__preview--${currentEffect}`);
    updateSlider();
  }
};

const resetEffects = () => {
  currentEffect = DEFAULT_EFFECT;
  previewImage.style.filter = 'none';
  previewImage.className = '';
  effectValueField.value = '';
  updateSlider();
};

const initEffects = () => {
  initSlider();
  updateSlider();

  scaleSmallerBtn.addEventListener('click', onScaleSmallerClick);
  scaleBiggerBtn.addEventListener('click', onScaleBiggerClick);
  effectsList.addEventListener('change', onEffectChange);
  updateScale();
};

export { initEffects, resetEffects };
