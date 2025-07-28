function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayItem(arr) {
  return arr[getRandomInt(0, arr.length - 1)];
}

function generateUniqueId(usedIds, min = 1, max = 10000) {
  let id;
  do {
    id = getRandomInt(min, max);
  } while (usedIds.has(id));
  usedIds.add(id);
  return id;
}

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

function generatePhotoDescriptions() {
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

const photos = generatePhotoDescriptions();
console.log(photos);
