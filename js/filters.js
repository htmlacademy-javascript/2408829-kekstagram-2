import { renderThumbnails } from './render-thumbnails.js';

const FILTER_DEFAULT = 'default';
const FILTER_RANDOM = 'random';
const FILTER_DISCUSSED = 'discussed';

const RANDOM_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const imgFilters = document.querySelector('.img-filters');
const filterButtons = imgFilters.querySelectorAll('.img-filters__button');

let originalPhotos = [];

const debounce = (callback, timeout) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), timeout);
  };
};

const getRandomUnique = (array) => {
  const copy = array.slice();
  const result = [];
  while (result.length < RANDOM_COUNT && copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy[index]);
    copy.splice(index, 1);
  }
  return result;
};

const getDiscussed = (array) => array.slice().sort((a, b) => b.comments.length - a.comments.length);

const updatePictures = (photos) => {
  document.querySelectorAll('.picture').forEach((el) => el.remove());
  renderThumbnails(photos);
};

const applyFilter = (filter) => {
  if (filter === FILTER_DEFAULT) {
    updatePictures(originalPhotos);
  } else if (filter === FILTER_RANDOM) {
    updatePictures(getRandomUnique(originalPhotos));
  } else if (filter === FILTER_DISCUSSED) {
    updatePictures(getDiscussed(originalPhotos));
  }
};

const debouncedFilter = debounce(applyFilter, DEBOUNCE_DELAY);

export const initFilters = (photos) => {
  originalPhotos = photos;

  imgFilters.classList.remove('img-filters--inactive');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('img-filters__button--active'));
      button.classList.add('img-filters__button--active');
      debouncedFilter(button.id.replace('filter-', ''));
    });
  });
};
