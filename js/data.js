import { getRandomInt, getRandomArrayItem, generateUniqueId } from './util.js';

const messages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const names = ['Артём', 'Ольга', 'Сергей', 'Мария', 'Иван', 'Елена', 'Дмитрий', 'Наталья', 'Алексей', 'Юлия'];

function generateComment(usedCommentIds) {
  const id = generateUniqueId(usedCommentIds);
  const avatar = `img/avatar-${getRandomInt(1, 6)}.svg`;
  const messageCount = getRandomInt(1, 2);
  const message = Array.from({ length: messageCount }, () => getRandomArrayItem(messages)).join(' ');
  const name = getRandomArrayItem(names);

  return {
    id,
    avatar,
    message,
    name,
  };
}

export function generatePhotoDescriptions() {
  const photoDescriptions = [];
  const usedCommentIds = new Set();

  for (let i = 1; i <= 25; i++) {
    const commentsCount = getRandomInt(0, 30);
    const comments = Array.from({ length: commentsCount }, () => generateComment(usedCommentIds));

    photoDescriptions.push({
      id: i,
      url: `photos/${i}.jpg`,
      description: `Описание фотографии №${i}`,
      likes: getRandomInt(15, 200),
      comments,
    });
  }

  return photoDescriptions;
}
