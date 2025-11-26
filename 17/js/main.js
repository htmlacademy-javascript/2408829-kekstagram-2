import { getData } from './data.js';
import { renderThumbnails } from './render-thumbnails.js';
import { openFullsizePhoto } from './render-fullsize.js';
import './form.js';
import { initFilters } from './filters.js';

getData()
  .then((photos) => {
    renderThumbnails(photos);

    initFilters(photos);

    const container = document.querySelector('.pictures');

    container.addEventListener('click', (evt) => {
      const picture = evt.target.closest('.picture');
      if (!picture) {
        return;
      }
      const index = picture.dataset.index;
      if (index !== undefined) {
        openFullsizePhoto(photos[index]);
      }
    });
  })
  .catch(() => {
    const template = document.querySelector('#data-error').content.querySelector('.data-error');
    const element = template.cloneNode(true);
    document.body.append(element);
    setTimeout(() => element.remove(), 5000);
  });
