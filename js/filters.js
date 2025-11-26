const FILTER_DEFAULT = 'filter-default';
const FILTER_RANDOM = 'filter-random';
const FILTER_DISCUSSED = 'filter-discussed';

const RANDOM_PHOTOS_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const imgFilters = document.querySelector('.img-filters');
const filterButtons = imgFilters.querySelectorAll('.img-filters__button');

let savedPhotos = [];
let debounceTimer = null;

function debounce(callback, delay) {
  return (...args) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

function showFilters() {
  imgFilters.classList.remove('img-filters--inactive');
}

function setActiveButton(button) {
  filterButtons.forEach((btn) => {
    btn.classList.remove('img-filters__button--active');
  });
  button.classList.add('img-filters__button--active');
}

function getDefaultPhotos() {
  return savedPhotos.slice();
}

function getRandomPhotos() {
  const shuffled = savedPhotos.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, RANDOM_PHOTOS_COUNT);
}

function getDiscussedPhotos() {
  return savedPhotos
    .slice()
    .sort((a, b) => b.comments.length - a.comments.length);
}

function applyFilter(filterName) {
  if (filterName === FILTER_DEFAULT) {
    return getDefaultPhotos();
  }
  if (filterName === FILTER_RANDOM) {
    return getRandomPhotos();
  }
  if (filterName === FILTER_DISCUSSED) {
    return getDiscussedPhotos();
  }
  return getDefaultPhotos();
}

export function initFilters(photos, onFilterChange) {
  savedPhotos = photos.slice();
  showFilters();

  const debouncedFilter = debounce((button) => {
    const filteredPhotos = applyFilter(button.id);
    onFilterChange(filteredPhotos);
  }, DEBOUNCE_DELAY);

  imgFilters.addEventListener('click', (evt) => {
    const target = evt.target;

    if (!target.classList.contains('img-filters__button')) {
      return;
    }

    setActiveButton(target);
    debouncedFilter(target);
  });
}
