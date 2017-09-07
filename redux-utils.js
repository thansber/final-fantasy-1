const sampleParty = () => {
  return [{
    charClass: randomCharClass(),
    name: 'AAAA',
    weapons: [], armor: [], spells: []
  }, {
    charClass: randomCharClass(),
    name: 'BBBB',
    weapons: [], armor: [], spells: []
  }, {
    charClass: randomCharClass(),
    name: 'CCCC',
    weapons: [], armor: [], spells: []
  }, {
    charClass: randomCharClass(),
    name: 'DDDD',
    weapons: [], armor: [], spells: []
  }];
}

const randomCharClass = () => {
  const charClasses = ['Fi', 'Th', 'BB', 'RM', 'WM', 'BM'];
  return charClasses[Math.floor(Math.random() * charClasses.length)];
}