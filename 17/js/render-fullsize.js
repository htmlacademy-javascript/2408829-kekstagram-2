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

let currentComments = [];
let shownComments = 0;
const COMMENTS_STEP = 5;

function onEscKeyDown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeFullsizePhoto();
  }
}

function renderNextComments() {
  const remaining = currentComments.length - shownComments;
  const count = Math.min(COMMENTS_STEP, remaining);

  const fragment = document.createDocumentFragment();

  for (let i = shownComments; i < shownComments + count; i++) {
    const comment = currentComments[i];
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
    fragment.appendChild(li);
  }

  commentsContainer.appendChild(fragment);
  shownComments += count;

  commentShownCount.textContent = shownComments;
  commentTotalCount.textContent = currentComments.length;

  if (shownComments >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
}

function closeFullsizePhoto() {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscKeyDown);
  commentsContainer.innerHTML = '';
  shownComments = 0;
}

export function openFullsizePhoto(photo) {
  pictureImg.src = photo.url;
  pictureImg.alt = photo.description;

  likesCount.textContent = photo.likes;
  pictureCaption.textContent = photo.description;

  currentComments = photo.comments;
  shownComments = 0;

  commentsContainer.innerHTML = '';

  commentTotalCount.textContent = currentComments.length;

  renderNextComments();

  commentCountBlock.classList.remove('hidden');

  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onEscKeyDown);
}

commentsLoader.addEventListener('click', () => {
  renderNextComments();
});

closeButton.addEventListener('click', () => {
  closeFullsizePhoto();
});
