function isStringLengthValid(str, maxLength) {
  return str.length <= maxLength;
}

console.log(isStringLengthValid('проверяемая строка', 20));
console.log(isStringLengthValid('проверяемая строка', 18)); 
console.log(isStringLengthValid('проверяемая строка', 10)); 

function isPalindrome(str) {
  const normalized = str.replaceAll(' ', '').toLowerCase();
  let reversed = '';

  for (let i = normalized.length - 1; i >= 0; i--) {
    reversed += normalized[i];
  }

  return normalized === reversed;
}

console.log(isPalindrome('топот'));                       
console.log(isPalindrome('ДовОд'));                       
console.log(isPalindrome('Кекс'));                        
console.log(isPalindrome('Лёша на полке клопа нашёл '));  
