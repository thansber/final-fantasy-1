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

  function CharClass(id, options) {
    this.id = id;
    this.label = options.label;

    allClassesById[id] = this;
  }

  new CharClass(fighter, { label: 'FIGHTER' });
  new CharClass(thief, { label: 'THIEF' });
  new CharClass(blackbelt, { label: 'Bl.BELT' });
  new CharClass(redmage, { label: 'RedMAGE' });
  new CharClass(whitemage, { label: 'Wh.MAGE' });
  new CharClass(blackmage, { label: 'Bl.MAGE' });

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