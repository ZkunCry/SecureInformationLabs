//Подсчет частоты символов
/**
 *
 * @param {string} text - Исходный текст
 * @returns {object}  {"М":1,"а":4,"м":3," ":2,"ы":1,"л":1,"р":1,"у":1} - пример объекта
 *
 */
const freqs = (text) =>
  [...text].reduce(
    (fs, c) => (fs[c] ? ((fs[c] = fs[c] + 1), fs) : ((fs[c] = 1), fs)),
    {}
  );
/**
 * Преобразование частот в пары
 * @param {object} freqs - Объект частот
 * @returns {Array} - Возвращает массив, состоящий из пар символ-частота, например
 * "[["М",1],["а",4],["м",3],[" ",2],["ы",1],["л",1],["р",1],["у",1]]"
 */
const topairs = (freqs) => Object.keys(freqs).map((c) => [c, freqs[c]]);
/**
 * Сортировка пар по частоте
 * @param {Array} pairs
 * @returns
 */
const sortps = (pairs) => pairs.sort((a, b) => a[1] - b[1]);
/**
 * Построение кодового дерева
 * @param {*} ps
 * @returns  [[[[[[["у",1],[[["л",1],["р",1]],2]],3],["м",3]],6],
 *           [[[[[[["М",1],["ы",1]],2],[" ",2]],4],["а",4]],8]],14]
 */
const tree = (ps) => {
  while (ps.length >= 2) {
    // Сортируем и объединяем первые два элемента
    ps = sortps([[ps.slice(0, 2), ps[0][1] + ps[1][1]]].concat(ps.slice(2)));
  }

  // Возвращаем единственный оставшийся элемент
  return ps[0];
};
/**
 * Преобразование дерева в таблицу кодов
 * @param {*} tree
 * @param {*} pfx
 * @returns
 */
const codes = (tree) => {
  const result = {};
  const stack = [[tree, ""]]; // Стек содержит пары: узел дерева и текущий префикс

  while (stack.length > 0) {
    const [node, pfx] = stack.pop(); // Извлекаем текущий узел и префикс

    // Если узел является массивом (внутренний узел дерева)
    if (Array.isArray(node[0])) {
      // Добавляем левый и правый узлы в стек с обновленными префиксами
      stack.push([node[0][1], pfx + "1"]); // Правое поддерево с префиксом "1"
      stack.push([node[0][0], pfx + "0"]); // Левое поддерево с префиксом "0"
    } else {
      // Если узел - это лист дерева, сохраняем код для него
      result[node[0]] = pfx;
    }
  }

  return result;
};
const getcodes = (text) => codes(tree(sortps(topairs(freqs(text)))));
let start = performance.now();
const prettyPrintTree = (node, indent = 0) => {
  if (node[0] instanceof Array) {
    // Если узел является массивом, рекурсивно обходим его дочерние узлы
    console.log(" ".repeat(indent) + "[");
    prettyPrintTree(node[0][0], indent + 2); // Левый дочерний узел
    prettyPrintTree(node[0][1], indent + 2); // Правый дочерний узел
    console.log(" ".repeat(indent) + `] (${node[1]})`); // Частота
  } else {
    // Если узел является символом, выводим его
    console.log(" ".repeat(indent) + `${node[0]} (${node[1]})`);
  }
};
function printInfromation() {
  const strings = ["ВБВБВАВБАВ", "Мама мыла раму"];
  strings.forEach((value) => {
    const start = performance.now();
    console.log(`Исходная строка: ${value}`);
    console.log("Дерево: ");
    const huffmanTree = tree(sortps(topairs(freqs(value))));
    prettyPrintTree(huffmanTree);
    // console.log(JSON.stringify(huffmanTree, null, 2));
    console.log(`Коды символов:`);
    console.log(codes(huffmanTree));
    const end = performance.now();
    console.log(`Время выполнения кода: ${end - start} `);
  });
}
printInfromation();
