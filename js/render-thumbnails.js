const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const picturesContainer = document.querySelector('.pictures');

const createThumbnail = (photo, index) => {
  const pictureElement = pictureTemplate.cloneNode(true);

  const img = pictureElement.querySelector('.picture__img');
  img.src = photo.url;
  img.alt = photo.description;

  pictureElement.querySelector('.picture__likes').textContent = photo.likes;
  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;

  pictureElement.dataset.index = index;

  return pictureElement;
};

export const renderThumbnails = (photoDescriptions) => {
  const fragment = document.createDocumentFragment();

  photoDescriptions.forEach((photo, index) => {
    const thumbnail = createThumbnail(photo, index);
    fragment.appendChild(thumbnail);
  });

  picturesContainer.appendChild(fragment);
};
