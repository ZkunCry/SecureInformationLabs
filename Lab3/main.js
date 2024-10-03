// Подсчет частоты символов
const freqs = (text) =>
  [...text].reduce(
    (fs, c) => (fs[c] ? ((fs[c] = fs[c] + 1), fs) : ((fs[c] = 1), fs)),
    {}
  );

// Преобразование частот в пары
const topairs = (freqs) => Object.keys(freqs).map((c) => [c, freqs[c]]);

// Сортировка пар по частоте
const sortps = (pairs) => pairs.sort((a, b) => a[1] - b[1]);

// Построение кодового дерева
const tree = (ps) => {
  while (ps.length >= 2) {
    ps = sortps([[ps.slice(0, 2), ps[0][1] + ps[1][1]]].concat(ps.slice(2)));
  }
  return ps[0];
};

// Преобразование дерева в таблицу кодов
const codes = (tree) => {
  const result = {};
  const stack = [[tree, ""]];
  while (stack.length > 0) {
    const [node, pfx] = stack.pop();
    if (Array.isArray(node[0])) {
      stack.push([node[0][1], pfx + "1"]);
      stack.push([node[0][0], pfx + "0"]);
    } else {
      result[node[0]] = pfx;
    }
  }
  return result;
};

// Кодирование сообщения с помощью кодов Хаффмана
const encodeMessage = (text, codes) => {
  return text
    .split("")
    .map((char) => codes[char])
    .join("");
};

// Восстановление символов из битовой строки с использованием дерева
const decodeMessage = (encoded, huffmanTree) => {
  let result = "";
  let node = huffmanTree;
  for (let bit of encoded) {
    node = bit === "0" ? node[0][0] : node[0][1];

    if (typeof node[0] === "string") {
      result += node[0]; // Добавляем символ к результату
      node = huffmanTree; // Возвращаемся в корень дерева
    }
  }
  return result;
};

// Сериализация дерева Хаффмана для передачи
const serializeTree = (node) => JSON.stringify(node, null);

// Десериализация дерева Хаффмана из строки
const deserializeTree = (str) => JSON.parse(str);

// Демонстрация кодирования и декодирования
function printInformation() {
  const strings = ["ВБВБВАВБАВ", "Мама мыла раму", "abcd"];
  strings.forEach((value) => {
    console.log(`Исходная строка: ${value}`);
    console.log("Массив частот: ", topairs(freqs(value)));
    // Построение кодового дерева
    const huffmanTree = tree(sortps(topairs(freqs(value))));
    const huffmanCodes = codes(huffmanTree);

    console.log("Коды символов:");
    console.log(huffmanCodes);

    // Кодирование сообщения
    const encodedMessage = encodeMessage(value, huffmanCodes);
    console.log(`Закодированное сообщение: ${encodedMessage}`);

    // Сериализация дерева
    const serializedTree = serializeTree(huffmanTree);
    console.log(`Сериализованное дерево: ${serializedTree}`);

    // Передача закодированного сообщения и дерева
    const transmittedData = { encodedMessage, tree: serializedTree };

    // Декодирование сообщения
    const deserializedTree = deserializeTree(transmittedData.tree);

    const decodedMessage = decodeMessage(
      transmittedData.encodedMessage,
      deserializedTree
    );
    console.log(`Декодированное сообщение: ${decodedMessage}`);
  });
}

printInformation();
console.log(freqs("Тест"));
