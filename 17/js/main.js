import { getData } from './data.js';
import { renderThumbnails } from './render-thumbnails.js';
import { openFullsizePhoto } from './render-fullsize.js';
import { initFilters, updateFilteredPictures } from './filters.js';
import './form.js';

const picturesContainer = document.querySelector('.pictures');
const imgFilters = document.querySelector('.img-filters');

let photos = [];

getData()
  .then((data) => {
    photos = data;

    renderThumbnails(photos);

    imgFilters.classList.remove('img-filters--inactive');
    initFilters(photos, updateFilteredPictures);

    picturesContainer.addEventListener('click', (evt) => {
      const picture = evt.target.closest('.picture');
      if (!picture) {
        return;
      }

      const index = picture.dataset.index;
      openFullsizePhoto(photos[Number(index)]);
    });
  })
  .catch(() => {
    const template = document
      .querySelector('#data-error')
      .content.querySelector('.data-error');
    const element = template.cloneNode(true);
    document.body.append(element);
    setTimeout(() => element.remove(), 5000);
  });
