const overlay = document.querySelector('.big-picture');
const image = overlay.querySelector('.big-picture__img img');
const likes = overlay.querySelector('.likes-count');
const caption = overlay.querySelector('.social__caption');
const commentsContainer = overlay.querySelector('.social__comments');
const cancelButton = overlay.querySelector('#picture-cancel');
const body = document.body;

const clearComments = () => {
  commentsContainer.innerHTML = '';
};

const createComment = (comment) => {
  const li = document.createElement('li');
  li.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  li.appendChild(img);
  li.appendChild(text);

  return li;
};

const renderFullsizePhoto = (photo) => {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');

  image.src = photo.url;
  likes.textContent = photo.likes;
  caption.textContent = photo.description;

  clearComments();

  const commentsFragment = document.createDocumentFragment();
  photo.comments.forEach((comment) => {
    commentsFragment.appendChild(createComment(comment));
  });

  commentsContainer.appendChild(commentsFragment);

  const closeFullsizePhoto = () => {
    overlay.classList.add('hidden');
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeFullsizePhoto();
    }
  };

  document.addEventListener('keydown', onEscKeyDown);

  cancelButton.addEventListener('click', () => {
    closeFullsizePhoto();
  });
};

export { renderFullsizePhoto };
