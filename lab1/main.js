// Функция для кодирования по Хэммингу
function hammingEncode(data) {
  let n = data.length;
  let r = 0;

  // Определение количества контрольных битов
  while (Math.pow(2, r) < n + r + 1) {
    r++;
  }

  // Инициализация кодового слова с нулями на местах контрольных битов
  let hammingCode = Array(n + r).fill(0);

  let j = 0;
  for (let i = 1; i <= n + r; i++) {
    if (Math.pow(2, j) === i) {
      j++;
    } else {
      hammingCode[i - 1] = parseInt(data[0]);
      data = data.slice(1);
    }
  }

  // Вычисление контрольных битов
  for (let i = 0; i < r; i++) {
    let pos = Math.pow(2, i);
    let value = 0;
    for (let j = 1; j <= hammingCode.length; j++) {
      if ((j & pos) !== 0) {
        value ^= hammingCode[j - 1];
      }
    }
    hammingCode[pos - 1] = value;
  }

  return hammingCode.join("");
}

// Функция для декодирования по Хэммингу
function hammingDecode(hammingCode) {
  let r = 0;
  let n = hammingCode.length;

  // Определение количества контрольных битов
  while (Math.pow(2, r) < n) {
    r++;
  }

  // Вычисление синдромов
  let errorPos = 0;
  for (let i = 0; i < r; i++) {
    let pos = Math.pow(2, i);
    let value = 0;
    for (let j = 1; j <= n; j++) {
      if ((j & pos) !== 0) {
        value ^= parseInt(hammingCode[j - 1]);
      }
    }
    if (value !== 0) {
      errorPos += pos;
    }
  }

  if (errorPos) {
    console.log(`Ошибка в позиции: ${errorPos}`);
    // Исправление ошибки
    hammingCode = hammingCode.split("");
    hammingCode[errorPos - 1] = hammingCode[errorPos - 1] === "0" ? "1" : "0";
    hammingCode = hammingCode.join("");
  }

  // Получение исходного сообщения
  let originalData = "";
  let j = 0;
  for (let i = 1; i <= n; i++) {
    if (Math.pow(2, j) !== i) {
      originalData += hammingCode[i - 1];
    } else {
      j++;
    }
  }

  return { originalData, correctedData: hammingCode };
}

// Функция для внесения ошибок в кодовое сообщение
function introduceError(hammingCode, numErrors = 1) {
  let hammingCodeArray = hammingCode.split("");
  let errorPositions = [];
  while (errorPositions.length < numErrors) {
    let errorPos = 7;
    if (!errorPositions.includes(errorPos)) {
      hammingCodeArray[errorPos] =
        hammingCodeArray[errorPos] === "0" ? "1" : "0";
      errorPositions.push(errorPos + 1);
    }
  }
  return { hammingCodeWithErrors: hammingCodeArray.join(""), errorPositions };
}

// Пример использования
let data = "0100010000111101"; // Исходное сообщение
let encodedData = hammingEncode(data);
console.log(`Кодовое сообщение: ${encodedData}`);

// Внесение одной ошибки
let { hammingCodeWithErrors, errorPositions } = introduceError(encodedData);
console.log(
  `Сообщение с ошибкой в позиции ${errorPositions}: ${hammingCodeWithErrors}`
);

// Декодирование и исправление
let { originalData, correctedData } = hammingDecode(hammingCodeWithErrors);
console.log(`Исправленное сообщение: ${correctedData}`);
console.log(`Исходное сообщение: ${originalData}`);
