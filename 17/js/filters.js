import { renderThumbnails } from './render-thumbnails.js';

const FILTER_DEFAULT = 'filter-default';
const FILTER_RANDOM = 'filter-random';
const FILTER_DISCUSSED = 'filter-discussed';

const RANDOM_COUNT = 10;

const filtersBlock = document.querySelector('.img-filters');
const buttons = filtersBlock.querySelectorAll('.img-filters__button');

let originalPhotos = [];

const clearPictures = () => {
  document.querySelectorAll('.picture').forEach((el) => el.remove());
};

const getRandomUnique = (items) => {
  const copy = [...items];
  const result = [];

  while (result.length < RANDOM_COUNT && copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length);
    const item = copy.splice(index, 1)[0];
    result.push(item);
  }

  return result;
};

const getDiscussed = (items) => {
  return [...items].sort((a, b) => b.comments.length - a.comments.length);
};

const debounce = (callback, timeout = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), timeout);
  };
};

const applyFilter = (filterName) => {
  clearPictures();

  let filtered = [];

  if (filterName === FILTER_DEFAULT) {
    filtered = originalPhotos;
  }

  if (filterName === FILTER_RANDOM) {
    filtered = getRandomUnique(originalPhotos);
  }

  if (filterName === FILTER_DISCUSSED) {
    filtered = getDiscussed(originalPhotos);
  }

  renderThumbnails(filtered);
};

const debouncedFilter = debounce(applyFilter, 500);

export const initFilters = (photos) => {
  originalPhotos = photos;

  filtersBlock.classList.remove('img-filters--inactive');

  buttons.forEach((btn) => {
    btn.addEventListener('click', (evt) => {
      buttons.forEach((b) => b.classList.remove('img-filters__button--active'));
      evt.target.classList.add('img-filters__button--active');
      debouncedFilter(evt.target.id);
    });
  });
};
