const GET_DATA_URL = 'https://31.javascript.htmlacademy.pro/kekstagram/data';
const SEND_DATA_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';

const getData = async () => {
  const response = await fetch(GET_DATA_URL);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.status}`);
  }
  return response.json();
};

const sendData = async (formData) => {
  const response = await fetch(SEND_DATA_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Ошибка отправки данных: ${response.status}`);
  }

  return response.json();
};

export { getData, sendData };
