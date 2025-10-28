import { getData } from './api.js';
import { renderThumbnails } from './render-thumbnails.js';
import { initFilters } from './filters.js';
import './form.js'; // важно — подключаем форму

getData()
  .then((photos) => {
    renderThumbnails(photos);
    initFilters(photos, renderThumbnails);
  })
  .catch((err) => {
    alert(`Ошибка при загрузке данных: ${err.message}`);
  });
