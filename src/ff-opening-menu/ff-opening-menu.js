(function(scope) {

  scope.FF = scope.FF || {};

   Polymer({
    is: 'ff-opening-menu',

    behaviors: [
      scope.FF.ScreenBehavior
    ],

    properties: {
      party: {
        type: Object
      },
      respondRate: {
        notify: true,
        type: Number,
        value: 6
      }
    },

    _hasSavedGame: function() {
      console.log('TODO: check for existing saved game');
      return true;
    },

    _loadSavedGame: function() {
      console.log('TODO: load from actual saved game');
      return [{
        charClass: 'WM',
        name: 'AAAA',
        weapons: [], armor: [], spells: []
      }, {
        charClass: 'Th',
        name: 'BBBB',
        weapons: [], armor: [], spells: []
      }, {
        charClass: 'BB',
        name: 'CCCC',
        weapons: [], armor: [], spells: []
      }, {
        charClass: 'RM',
        name: 'DDDD',
        weapons: [], armor: [], spells: []
      }];
    },

    _next: function(e, detail) {
      if (detail.value === 'continue') {
        if (this._hasSavedGame()) {
          this.fire('ff-load-game', {
            party: this._loadSavedGame()
          });
          return;
        }
        this.fire('ff-screen', { screen: 'charSelect' });
      } else if (detail.value === 'new') {
        this.fire('ff-screen', { screen: 'charSelect' });
      }
    },

    _respondRateChange: function(amount) {
      var newRespondRate = this.respondRate + amount;
      if (newRespondRate < 1) {
        newRespondRate = 8;
      }
      if (newRespondRate > 8) {
        newRespondRate = 1;
      }
      this.set('respondRate', newRespondRate);
    },

    _respondRateLower: function() {
      this._respondRateChange(-1);
    },

    _respondRateRaise: function() {
      this._respondRateChange(1);
    }

  });

 }(window));