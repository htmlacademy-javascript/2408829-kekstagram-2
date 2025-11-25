import { getData } from './data.js';
import { renderThumbnails } from './render-thumbnails.js';
import { openFullsizePhoto } from './render-fullsize.js';
import './form.js';

getData()
  .then((photos) => {
    renderThumbnails(photos);

    const picturesContainer = document.querySelector('.pictures');

    picturesContainer.addEventListener('click', (evt) => {
      const picture = evt.target.closest('.picture');
      if (!picture) {
        return;
      }

      const index = picture.dataset.index;
      if (index !== undefined) {
        openFullsizePhoto(photos[+index]);
      }
    });
  })
  .catch(() => {
    const errorTemplate = document
      .querySelector('#data-error')
      .content.querySelector('.data-error');
    document.body.append(errorTemplate.cloneNode(true));
  });
