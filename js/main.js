import { getData } from './data.js';
import { renderThumbnails } from './render-thumbnails.js';
import { initFilters } from './filters.js';
import './form.js';

const showDataError = () => {
  const template = document.querySelector('#data-error').content.querySelector('.data-error');
  const element = template.cloneNode(true);
  document.body.append(element);

  setTimeout(() => {
    element.remove();
  }, 5000);
};

getData()
  .then((photos) => {
    renderThumbnails(photos);
    initFilters(photos);
  })
  .catch(() => {
    showDataError();
  });
