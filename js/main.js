import { getData } from './data.js';
import { renderThumbnails } from './render-thumbnails.js';
import { initFilters } from './filters.js';
import { renderFullsizePhoto } from './render-fullsize.js';
import './form.js';

const picturesContainer = document.querySelector('.pictures');

function showDataError() {
  const template = document.querySelector('#data-error').content.querySelector('.data-error');
  const element = template.cloneNode(true);
  document.body.append(element);

  setTimeout(() => {
    element.remove();
  }, 5000);
}

let photosCache = [];

function onPicturesClick(evt) {
  const picture = evt.target.closest('.picture');
  if (!picture) {
    return;
  }

  const pictureId = Number(picture.dataset.id);
  const photo = photosCache.find((item) => item.id === pictureId);

  if (photo) {
    renderFullsizePhoto(photo);
  }
}

getData()
  .then((photos) => {
    photosCache = photos.slice();
    renderThumbnails(photosCache);
    initFilters(photosCache);
    picturesContainer.addEventListener('click', onPicturesClick);
  })
  .catch(() => {
    showDataError();
  });
