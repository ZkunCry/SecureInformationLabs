// Функция для проверки, является ли число простым
function isPrime(num) {
  if (num < 2n) return false;
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
function modInverseBruteForce(e, phi) {
  for (let d = 1n; d < phi; d++) {
    if ((e * d) % phi === 1n) {
      return d;
    }
  }
  throw new Error("No modular inverse exists");
}
/*
Функция для возведения в степень по модулю
------------------------------------
base = base % mod; - 
Этот шаг уменьшает базу до значения, которое находится в диапазоне от 0 до mod−1. 
Это делается для оптимизации, потому что при вычислении степени по модулю, 
значение базы можно сразу сократить.
------------------------------------
while (exp > 0n)
Этот цикл выполняется до тех пор, пока показатель степени 
exp не станет равным 0. 
Это основной цикл алгоритма, который поэтапно уменьшает показатель, 
параллельно вычисляя результат.
------------------------------------
if (exp % 2n === 1n)
  result = (result * base) % mod;
Алгоритм быстрого возведения в степень основан на разложении показателя в двоичное представление. 
Если текущий показатель exp
нечетный (остаток от деления на 2 равен 1), то текущая база умножается на результат, 
и это произведение снова берётся по модулю mod. 
Это условие отвечает за случаи, когда двоичный разряд показателя равен 1
-----------------------------------
base = (base * base) % mod;
Независимо от того, был ли показатель чётным или нечетным, 
база возводится в квадрат, а результат снова берётся по модулю mod
Возведение базы в квадрат на каждом шаге связано с тем, 
что мы переходим к следующему разряду в двоичной форме показателя степени.
*/
function modPow(base, exp, mod) {
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n)
      // если exp нечетное
      result = (result * base) % mod;
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  return result;
}

// Генерация ключей RSA
function generateKeys() {
  const min = 100n;
  const max = 1000n;

  const p = generateRandomPrime(min, max); // Генерация случайного простого числа p
  const q = generateRandomPrime(min, max); // Генерация случайного простого числа q
  const n = p * q; // Модуль n
  const phi = (p - 1n) * (q - 1n); // Функция Эйлера

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
  console.log(messageCode);
  return messageCode.map((m) => modPow(m, publicKey.e, publicKey.n));
}

// Дешифрование
function decrypt(cipher, privateKey) {
  const decryptedCode = cipher.map((c) =>
    modPow(c, privateKey.d, privateKey.n)
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
