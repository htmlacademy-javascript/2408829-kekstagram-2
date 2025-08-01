export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomArrayItem(arr) {
  return arr[getRandomInt(0, arr.length - 1)];
}

export function generateUniqueId(usedIds, min = 1, max = 10000) {
  let id;
  do {
    id = getRandomInt(min, max);
  } while (usedIds.has(id));
  usedIds.add(id);
  return id;
}
