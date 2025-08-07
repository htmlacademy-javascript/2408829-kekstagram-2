
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const picturesContainer = document.querySelector('.pictures');

const createThumbnail = (photo) => {
  const pictureElement = pictureTemplate.cloneNode(true);

  const img = pictureElement.querySelector('.picture__img');
  img.src = photo.url;
  img.alt = photo.description;

  pictureElement.querySelector('.picture__likes').textContent = photo.likes;
  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;

  return pictureElement;
};

export const renderThumbnails = (photoDescriptions) => {
  const fragment = document.createDocumentFragment();

  photoDescriptions.forEach((photo) => {
    const thumbnail = createThumbnail(photo);
    fragment.appendChild(thumbnail);
  });

  picturesContainer.appendChild(fragment);
};
