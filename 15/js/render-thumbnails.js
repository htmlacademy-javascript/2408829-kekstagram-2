import { renderFullsizePhoto } from './render-fullsize.js';

const container = document.querySelector('.pictures');
const template = document.querySelector('#picture').content.querySelector('.picture');

const renderThumbnails = (pictures) => {
  const fragment = document.createDocumentFragment();

  pictures.forEach((picture) => {
    const element = template.cloneNode(true);
    element.querySelector('.picture__img').src = picture.url;
    element.querySelector('.picture__likes').textContent = picture.likes;
    element.querySelector('.picture__comments').textContent = picture.comments.length;

    element.addEventListener('click', () => {
      renderFullsizePhoto(picture);
    });

    fragment.appendChild(element);
  });

  container.appendChild(fragment);
};

export { renderThumbnails };
