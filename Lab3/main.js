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
console.log("Исходная строка: ВБВБВАВБАВ");
const huffmanTree2 = tree(sortps(topairs(freqs("ВБВБВАВБАВ"))));
console.log(JSON.stringify(huffmanTree2, null, 2));
console.log("Результат: ", getcodes("ВБВБВАВБАВ"));

console.log("Исходная строка 2: Мама мыла раму");
console.log("Результат: ", getcodes("Мама мыла раму"));
const huffmanTree = tree(sortps(topairs(freqs("Мама мыла раму"))));
