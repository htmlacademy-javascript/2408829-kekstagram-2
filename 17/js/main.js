import { getData } from './data.js';
import { renderThumbnails } from './render-thumbnails.js';
import { openFullsizePhoto } from './render-fullsize.js';
import './form.js';
import './filters.js';

getData()
  .then((photos) => {
    renderThumbnails(photos);

    const picturesContainer = document.querySelector('.pictures');

    picturesContainer.addEventListener('click', (evt) => {
      const picture = evt.target.closest('.picture');
      if (!picture) {
        return;
      }

      const index = Number(picture.dataset.index);
      openFullsizePhoto(photos[index]);
    });

    const imgFilters = document.querySelector('.img-filters');
    imgFilters.classList.remove('img-filters--inactive');
  })
  .catch(() => {
    const template = document.querySelector('#data-error').content.querySelector('.data-error');
    const element = template.cloneNode(true);
    document.body.append(element);
    setTimeout(() => element.remove(), 5000);
  });
