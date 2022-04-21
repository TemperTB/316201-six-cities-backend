const doIt = (str) => ({str: str.split(';')
  .map((good) => (good)),
});

console.log(doIt('one;two;three'));
