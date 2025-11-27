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

const COMMENTS_PER_PORTION = 5;

let currentComments = [];
let shownCommentsCount = 0;

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

const updateCommentsView = () => {
  const fragment = document.createDocumentFragment();
  const nextCount = Math.min(currentComments.length, shownCommentsCount + COMMENTS_PER_PORTION);

  for (let i = shownCommentsCount; i < nextCount; i++) {
    fragment.appendChild(createCommentElement(currentComments[i]));
  }

  commentsContainer.appendChild(fragment);

  shownCommentsCount = nextCount;

  commentShownCount.textContent = shownCommentsCount;
  commentTotalCount.textContent = currentComments.length;

  if (shownCommentsCount >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }

  if (currentComments.length === 0) {
    commentCountBlock.classList.add('hidden');
    commentsLoader.classList.add('hidden');
  } else {
    commentCountBlock.classList.remove('hidden');
  }
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeFullsizePhoto();
  }
}

const openFullsizePhotoInternal = (photo) => {
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  pictureImg.src = photo.url;
  pictureImg.alt = photo.description;
  likesCount.textContent = photo.likes;
  pictureCaption.textContent = photo.description;

  commentsContainer.innerHTML = '';
  currentComments = photo.comments.slice();
  shownCommentsCount = 0;

  updateCommentsView();

  document.addEventListener('keydown', onDocumentKeydown);
};

function closeFullsizePhoto() {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

commentsLoader.addEventListener('click', () => {
  updateCommentsView();
});

closeButton.addEventListener('click', () => {
  closeFullsizePhoto();
});

export const renderFullsizePhoto = (photo) => {
  openFullsizePhotoInternal(photo);
};
