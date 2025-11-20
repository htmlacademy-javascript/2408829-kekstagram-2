import { getData } from './data.js';
import { renderThumbnails } from './render-thumbnails.js';
import { initForm } from './form.js';

getData()
  .then((pictures) => {
    renderThumbnails(pictures);
  })
  .catch(() => {
    const errorTemplate = document.querySelector('#data-error').content.querySelector('.data-error');
    document.body.append(errorTemplate.cloneNode(true));
  });

initForm();
