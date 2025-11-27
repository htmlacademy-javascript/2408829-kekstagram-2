import { renderThumbnails } from './render-thumbnails.js';

const FILTER_DEFAULT = 'filter-default';
const FILTER_RANDOM = 'filter-random';
const FILTER_DISCUSSED = 'filter-discussed';
const RANDOM_PHOTOS_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const filtersBlock = document.querySelector('.img-filters');
const filtersForm = filtersBlock.querySelector('.img-filters__form');
const filterButtons = filtersForm.querySelectorAll('.img-filters__button');

let originalPhotos = [];
let isInitialized = false;

const debounce = (callback, timeoutDelay = DEBOUNCE_DELAY) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), timeoutDelay);
  };
};

const clearThumbnails = () => {
  const pictures = document.querySelectorAll('.picture');
  pictures.forEach((picture) => picture.remove());
};

const getRandomPhotos = (photos) => {
  const copy = photos.slice();
  const result = [];

  const count = Math.min(RANDOM_PHOTOS_COUNT, copy.length);

  while (result.length < count) {
    const randomIndex = Math.floor(Math.random() * copy.length);
    const [item] = copy.splice(randomIndex, 1);
    result.push(item);
  }

  return result;
};

const getDiscussedPhotos = (photos) => photos.slice().sort((a, b) => b.comments.length - a.comments.length);

const applyFilter = (filterId) => {
  clearThumbnails();

  let photosToRender = originalPhotos;

  if (filterId === FILTER_RANDOM) {
    photosToRender = getRandomPhotos(originalPhotos);
  }

  if (filterId === FILTER_DISCUSSED) {
    photosToRender = getDiscussedPhotos(originalPhotos);
  }

  renderThumbnails(photosToRender);
};

const debouncedApplyFilter = debounce(applyFilter);

export const initFilters = (photos) => {
  if (isInitialized) {
    return;
  }

  isInitialized = true;
  originalPhotos = photos.slice();

  filtersBlock.classList.remove('img-filters--inactive');

  filtersForm.addEventListener('click', (evt) => {
    if (!evt.target.classList.contains('img-filters__button')) {
      return;
    }

    filterButtons.forEach((button) => button.classList.remove('img-filters__button--active'));
    evt.target.classList.add('img-filters__button--active');

    debouncedApplyFilter(evt.target.id);
  });
};
