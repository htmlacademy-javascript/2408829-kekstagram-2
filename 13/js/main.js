import { getData } from './api.js';
import { renderThumbnails } from './render-thumbnails.js';
import { initFilters } from './filters.js';
import { initForm } from './form.js';
import { initEffects } from './effects.js';

getData()
  .then((photos) => {
    renderThumbnails(photos);
    initFilters(photos, renderThumbnails);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  })
  .catch((err) => {
    alert(`Ошибка загрузки данных: ${err.message}`);
  });

initForm();
initEffects();
