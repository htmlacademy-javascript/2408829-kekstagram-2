export const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomArrayItem = (arr) =>
  arr[getRandomInt(0, arr.length - 1)];

export const generateUniqueId = (usedIds, min = 1, max = 10000) => {
  let id;
  do {
    id = getRandomInt(min, max);
  } while (usedIds.has(id));
  usedIds.add(id);
  return id;
};
