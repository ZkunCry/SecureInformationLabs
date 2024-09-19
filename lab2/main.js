// Функция для проверки, является ли число простым

/**
 * 
Для оптимизации проверки делимости, вычисляется квадратный корень из num. 
Если число num не делится на любое число до его квадратного корня,
 то оно не будет делиться и на числа больше квадратного корня.
 */
function isPrime(num) {
  if (num < 2n) return false; //Простые числа начинаются с 2
  const sqrt = BigInt(Math.floor(Math.sqrt(Number(num)))); // Округляем до целого и преобразуем в BigInt
  for (let i = 2n; i <= sqrt; i++) {
    if (num % i === 0n) return false;
  }
  return true;
}

// Функция для генерации случайного простого числа
function generateRandomPrime(min, max) {
  let prime = 0n;
  while (!isPrime(prime)) {
    prime = BigInt(
      Math.floor(Math.random() * (Number(max) - Number(min))) + Number(min)
    );
  }
  return prime;
}

// Функция для вычисления наибольшего общего делителя (НОД)
function gcd(a, b) {
  while (b != 0n) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}
// Функция для вычисления обратного по модулю числа
//Остаток от деления должен равняться 1.
function modInverseBruteForce(e, phi) {
  for (let d = 1n; d < phi; d++) {
    if ((e * d) % phi === 1n) {
      return d;
    }
  }
  throw new Error("No modular inverse exists");
}
function naiveModPow(base, exp, mod) {
  let result = 1n; // Инициализируем результат как 1
  base = base % mod; // Приводим основание к модулю
  for (let i = 0n; i < exp; i++) {
    result = (result * base) % mod; // Умножаем результат на основание и берем модуль
  }

  return result; // Возвращаем результат
}

// Генерация ключей RSA
function generateKeys() {
  const min = 100n;
  const max = 1000n;

  const p = generateRandomPrime(min, max); // Генерация случайного простого числа p
  const q = generateRandomPrime(min, max); // Генерация случайного простого числа q
  const n = p * q; // Модуль n
  const phi = (p - 1n) * (q - 1n); // Функция Эйлера
  console.log(phi);
  let e = 3n; // Открытая экспонента
  while (gcd(e, phi) !== 1n) {
    e += 2n;
  }

  const d = modInverseBruteForce(e, phi); // Секретная экспонента

  return {
    publicKey: { e: e, n: n },
    privateKey: { d: d, n: n },
  };
}

// Шифрование
function encrypt(message, publicKey) {
  const messageCode = message.split("").map((c) => BigInt(c.charCodeAt(0)));
  return messageCode.map((m) => naiveModPow(m, publicKey.e, publicKey.n));
}

// Дешифрование
function decrypt(cipher, privateKey) {
  const decryptedCode = cipher.map((c) =>
    naiveModPow(c, privateKey.d, privateKey.n)
  );
  return decryptedCode.map((c) => String.fromCharCode(Number(c))).join("");
}

// Пример использования
const { publicKey, privateKey } = generateKeys();

console.log("Открытый ключ: ", publicKey);
console.log("Закрытый ключ: ", privateKey);

const message = "ЕВРО";
console.log("Сообщение: ", message);

const encrypted = encrypt(message, publicKey);
console.log("Зашифрованное сообщение: ", encrypted);

const decrypted = decrypt(encrypted, privateKey);
console.log("Расшифрованное сообщение: ", decrypted);
