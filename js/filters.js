import { renderThumbnails } from './render-thumbnails.js';

const FILTER_DEFAULT = 'filter-default';
const FILTER_RANDOM = 'filter-random';
const FILTER_DISCUSSED = 'filter-discussed';

const RANDOM_PHOTO_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const filtersBlock = document.querySelector('.img-filters');
const buttons = filtersBlock.querySelectorAll('.img-filters__button');

let currentPhotos = [];
let activeFilter = FILTER_DEFAULT;

const debounce = (callback, timeout = DEBOUNCE_DELAY) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), timeout);
  };
};

const clearThumbnails = () => {
  document.querySelectorAll('.picture').forEach((el) => el.remove());
};

const getRandomUnique = (photos) => {
  const shuffled = [...photos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, RANDOM_PHOTO_COUNT);
};

const getDiscussed = (photos) => {
  return [...photos].sort((a, b) => b.comments.length - a.comments.length);
};

const applyFilter = () => {
  clearThumbnails();

  let filtered = [];

  if (activeFilter === FILTER_DEFAULT) {
    filtered = currentPhotos;
  }

  if (activeFilter === FILTER_RANDOM) {
    filtered = getRandomUnique(currentPhotos);
  }

  if (activeFilter === FILTER_DISCUSSED) {
    filtered = getDiscussed(currentPhotos);
  }

  renderThumbnails(filtered);
};

const debouncedApplyFilter = debounce(applyFilter);

const onFilterClick = (evt) => {
  if (!evt.target.classList.contains('img-filters__button')) {
    return;
  }

  buttons.forEach((btn) => btn.classList.remove('img-filters__button--active'));
  evt.target.classList.add('img-filters__button--active');

  activeFilter = evt.target.id;

  debouncedApplyFilter();
};

export const initFilters = (photos) => {
  currentPhotos = photos;

  filtersBlock.classList.remove('img-filters--inactive');

  buttons.forEach((btn) => {
    btn.addEventListener('click', onFilterClick);
  });
};
