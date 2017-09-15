const sampleParty = () => {
  return [{
    charClass: randomCharClass(),
    name: 'AAAA',
    weapons: ['Silver[K]', 'Mage[R]', 'Scimtar', 'Flame[S]'], armor: [], spells: [],
    status: []
  }, {
    charClass: randomCharClass(),
    name: 'BBBB',
    weapons: [], armor: ['Silver[B]', 'Iron[G]', 'Opal[H]', 'Steel[A]'], spells: [],
    status: []
  }, {
    charClass: 'BM', //randomCharClass(),
    name: 'CCCC',
    weapons: [], armor: [], spells: [['LIT'],[],['FIR2','CUR2','LIT2']],
    status: []
  }, {
    charClass: randomCharClass(),
    name: 'DDDD',
    weapons: [], armor: [], spells: [],
    status: []
  }];
}

const randomCharClass = () => {
  const charClasses = ['Fi', 'Th', 'BB', 'RM', 'WM', 'BM'];
  return charClasses[Math.floor(Math.random() * charClasses.length)];
}