const GET_URL = 'https://31.javascript.htmlacademy.pro/kekstagram/data';
const POST_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';

const getData = () =>
  fetch(GET_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      return response.json();
    });

const sendData = (body) =>
  fetch(POST_URL, {
    method: 'POST',
    body,
  });

export { getData, sendData };
