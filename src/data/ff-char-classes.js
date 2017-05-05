(function(scope) {
  scope.FF = scope.FF || {};

  if (scope.FF.CharClasses) {
    return;
  }

  var allClassesById = {};

  var fighter = 'fighter';
  var thief = 'thief';
  var blackbelt = 'blackbelt';
  var redmage = 'redmage';
  var whitemage = 'whitemage';
  var blackmage = 'blackmage';

  var knight = 'knight';
  var ninja = 'ninja';
  var master = 'master';
  var redwizard = 'redwizard';
  var whitewizard = 'whitewizard';
  var blackwizard = 'blackwizard';

  function CharClass(id, options) {
    this.id = id;
    this.label = options.label;
    this.walkRow = options.walkRow;

    allClassesById[id] = this;
  }

  // basic classes
  new CharClass(fighter, {
    label: 'FIGHTER',
    walkRow: 0
  });
  new CharClass(thief, {
    label: 'THIEF',
    walkRow: 1
  });
  new CharClass(blackbelt, {
    label: 'Bl.BELT',
    walkRow: 2
  });
  new CharClass(redmage, {
    label: 'RedMAGE',
    walkRow: 3
  });
  new CharClass(whitemage, {
    label: 'Wh.MAGE',
    walkRow: 4
  });
  new CharClass(blackmage, {
    label: 'Bl.MAGE',
    walkRow: 5
  });

  // advanced classes
  new CharClass(knight, {
    walkRow: 6
  });
  new CharClass(ninja, {
    walkRow: 7
  });
  new CharClass(master, {
    walkRow: 8
  });
  new CharClass(redwizard, {
    walkRow: 9
  });
  new CharClass(whitewizard, {
    walkRow: 10
  });
  new CharClass(blackwizard, {
    walkRow: 11
  });

  var basicClassIndex = function(id) {
    return basicClasses.findIndex(function(charClass) {
      return charClass.id === id;
    });
  };

  var fromId = function(id) {
    return allClassesById[id];
  };

  var basicClasses = [
    fromId(fighter),
    fromId(thief),
    fromId(blackbelt),
    fromId(redmage),
    fromId(whitemage),
    fromId(blackmage)
  ];

  scope.FF.CharClasses = {
    basicClasses: basicClasses,
    basicClassIndex: basicClassIndex,
    fromId: fromId
  };
}(window));