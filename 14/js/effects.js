const EFFECTS = {
  none: { range: { min: 0, max: 100 }, start: 100, step: 1, style: '', unit: '' },
  chrome: { range: { min: 0, max: 1 }, start: 1, step: 0.1, style: 'grayscale', unit: '' },
  sepia: { range: { min: 0, max: 1 }, start: 1, step: 0.1, style: 'sepia', unit: '' },
  marvin: { range: { min: 0, max: 100 }, start: 100, step: 1, style: 'invert', unit: '%' },
  phobos: { range: { min: 0, max: 3 }, start: 3, step: 0.1, style: 'blur', unit: 'px' },
  heat: { range: { min: 1, max: 3 }, start: 3, step: 0.1, style: 'brightness', unit: '' },
};

const form = document.querySelector('.img-upload__form');
const sliderContainer = form.querySelector('.effect-level');
const sliderElement = form.querySelector('.effect-level__slider');
const effectValue = form.querySelector('.effect-level__value');
const preview = form.querySelector('.img-upload__preview img');
const effectsList = form.querySelector('.effects__list');

let currentEffect = EFFECTS.none;

const isDefault = () => currentEffect === EFFECTS.none;

const updateSlider = () => {
  sliderElement.noUiSlider.updateOptions({
    range: currentEffect.range,
    start: currentEffect.start,
    step: currentEffect.step,
  });

  if (isDefault()) {
    sliderContainer.classList.add('hidden');
  } else {
    sliderContainer.classList.remove('hidden');
  }
};

const onSliderUpdate = () => {
  const value = sliderElement.noUiSlider.get();
  effectValue.value = value;
  preview.style.filter = isDefault() ? '' : `${currentEffect.style}(${value}${currentEffect.unit})`;
};

const onEffectChange = (evt) => {
  currentEffect = EFFECTS[evt.target.value];
  updateSlider();
  onSliderUpdate();
};

const initSlider = () => {
  noUiSlider.create(sliderElement, {
    range: currentEffect.range,
    start: currentEffect.start,
    step: currentEffect.step,
    connect: 'lower',
  });

  sliderElement.noUiSlider.on('update', onSliderUpdate);
};

const initEffects = () => {
  initSlider();
  effectsList.addEventListener('change', onEffectChange);
  sliderContainer.classList.add('hidden');
};

export { initEffects };
