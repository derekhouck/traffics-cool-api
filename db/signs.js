// const signs = ['hXoJ6rm0g7.svg', 'AevAWAIz0S.svg', 'F1NzzyQZxw.svg', 'BOCPWsppWy.svg', 'xTG2bCuUE8.svg', '9rRXuX2HFV.svg', 'o58ETrG7B3.svg', '3Pim1J3lBH.svg', 'Y4xbwGXQ8K.svg', 'IPuTyfKrzg.svg'];
// Answers = ['stop', 'yield', 'do not enter', 'no u-turn', 'merging traffic', 'right turn only', 'railroad crossing', 'signal ahead', 'deer crossing', 'no parking']

const signs = [
  {
    sign: 'hXoJ6rm0g7.svg',
    answer: 'stop',
    m: 1,
    next: 1,
  },
  {
    sign: 'AevAWAIz0S.svg',
    answer: 'yield',
    m: 1,
    next: 2,
  },
  {
    sign: 'F1NzzyQZxw.svg',
    answer: 'do not enter',
    m: 1,
    next: 3,
  },
  {
    sign: 'BOCPWsppWy.svg',
    answer: 'no u-turn',
    m: 1,
    next: 4,
  },
  {
    sign: 'xTG2bCuUE8.svg',
    answer: 'merging traffic',
    m: 1,
    next: 5,
  },
  {
    sign: '9rRXuX2HFV.svg',
    answer: 'right turn only',
    m: 1,
    next: 6,
  },
  {
    sign: 'o58ETrG7B3.svg',
    answer: 'railroad crossing',
    m: 1,
    next: 7,
  },
  {
    sign: '3Pim1J3lBH.svg',
    answer: 'signal ahead',
    m: 1,
    next: 8,
  },
  {
    sign: 'Y4xbwGXQ8K.svg',
    answer: 'deer crossing',
    m: 1,
    next: 9,
  },
  {
    sign: 'IPuTyfKrzg.svg',
    answer: 'no parking',
    m: 1,
    next: null,
  },
];

module.exports = signs;