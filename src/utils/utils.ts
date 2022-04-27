/**
 * Возвращает рандомное число из заданного интервала, округленное до определенного знака
 * @param min - минимальное число
 * @param max - максимальное число
 * @param numAfterDigit - количество знаков после запятой
 */
export const generateRandomValue = (min:number, max: number, numAfterDigit = 0) =>
  +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);

/**
 * Возвращает рандомное количество элементов массива
 * @param items - массив
 */
export const getRandomItems = <T>(items: T[]):T[] => {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
};

/**
 * Возвращает случайный элемент массива
 * @param items - массив
 */
export const getRandomItem = <T>(items: T[]):T =>
  items[generateRandomValue(0, items.length -1)];
