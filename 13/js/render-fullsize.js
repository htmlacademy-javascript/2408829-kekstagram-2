const bigPicture = document.querySelector('.big-picture');
const body = document.body;

const pictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentShownCount = bigPicture.querySelector('.social__comment-shown-count');
const commentTotalCount = bigPicture.querySelector('.social__comment-total-count');
const commentsContainer = bigPicture.querySelector('.social__comments');
const pictureCaption = bigPicture.querySelector('.social__caption');

const commentCountBlock = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

const closeFullsizePhoto = () => {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscKeyDown);
};

const onEscKeyDown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeFullsizePhoto();
  }
};

const createCommentElement = (comment) => {
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

export const openFullsizePhoto = (photo) => {
  pictureImg.src = photo.url;
  pictureImg.alt = photo.description;

  likesCount.textContent = photo.likes;
  commentShownCount.textContent = photo.comments.length;
  commentTotalCount.textContent = photo.comments.length;

  pictureCaption.textContent = photo.description;

  commentsContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();
  photo.comments.forEach((comment) => {
    fragment.appendChild(createCommentElement(comment));
  });
  commentsContainer.appendChild(fragment);

  commentCountBlock.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onEscKeyDown);
};

closeButton.addEventListener('click', () => {
  closeFullsizePhoto();
});
