const EFFECTS = {
  none: { range: { min: 0, max: 100 }, start: 100, step: 1, style: '', unit: '' },
  chrome: { range: { min: 0, max: 1 }, start: 1, step: 0.1, style: 'grayscale', unit: '' },
  sepia: { range: { min: 0, max: 1 }, start: 1, step: 0.1, style: 'sepia', unit: '' },
  marvin: { range: { min: 0, max: 100 }, start: 100, step: 1, style: 'invert', unit: '%' },
  phobos: { range: { min: 0, max: 3 }, start: 3, step: 0.1, style: 'blur', unit: 'px' },
  heat: { range: { min: 1, max: 3 }, start: 3, step: 0.1, style: 'brightness', unit: '' },
};

const preview = document.querySelector('.img-upload__preview img');
const sliderContainer = document.querySelector('.effect-level__slider');
const effectValue = document.querySelector('.effect-level__value');
const effectsList = document.querySelector('.effects__list');
const effectLevel = document.querySelector('.img-upload__effect-level');

let currentEffect = 'none';
let slider = null;

const updateEffect = (value) => {
  const effect = EFFECTS[currentEffect];
  preview.style.filter = effect.style ? `${effect.style}(${value}${effect.unit})` : '';
  effectValue.value = value;
};

const createSlider = (effect) => {
  if (!slider) {
    noUiSlider.create(sliderContainer, {
      range: effect.range,
      start: effect.start,
      step: effect.step,
      connect: 'lower',
    });

    slider = sliderContainer.noUiSlider;

    slider.on('update', (values) => {
      updateEffect(values[0]);
    });
  } else {
    slider.updateOptions({
      range: effect.range,
      start: effect.start,
      step: effect.step,
    });
  }

  slider.set(effect.start);
};

export const resetEffects = () => {
  currentEffect = 'none';
  preview.style.filter = '';
  effectValue.value = '';
  if (slider) {
    slider.set(EFFECTS.none.start);
  }
  effectLevel.classList.add('hidden');
};

export const initEffects = () => {
  createSlider(EFFECTS.none);
  effectLevel.classList.add('hidden');

  effectsList.addEventListener('change', (evt) => {
    if (evt.target.name !== 'effect') {
      return;
    }

    currentEffect = evt.target.value;
    const effect = EFFECTS[currentEffect];

    if (currentEffect === 'none') {
      effectLevel.classList.add('hidden');
      preview.style.filter = '';
    } else {
      effectLevel.classList.remove('hidden');
    }

    createSlider(effect);
    updateEffect(effect.start);
  });
};
