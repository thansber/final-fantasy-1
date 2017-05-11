Polymer({
    is: 'ff-app',

    properties: {
      charIndex: {
        notify: true,
        type: Number,
        value: 0
      },
      firstCharClass: {
        notify: true,
        type: String
      },
      party: {
        notify: true,
        type: Array,
        value: function() {
          // TODO: remove this default party
          return [{
            charClass: 'fighter',
            name: 'AAAA'
          }, {
            charClass: 'thief',
            name: 'BBBB'
          }, {
            charClass: 'blackbelt',
            name: 'CCCC'
          }, {
            charClass: 'redmage',
            name: 'DDDD'
          }];
        }
      }
    },

    listeners: {
      'ff-screen': '_onScreenChange',
      'ff-start-game': '_onStartGame'
    },

    ready: function() {
      this.screenChanged('intro');
    },

    screenChanged: function(screen) {
      var screens = Polymer.dom(this.$.screens);
      var oldScreen = screens.querySelector('[current-screen]');
      var newScreen = screens.querySelector('[screen="' + screen + '"]');

      if (oldScreen) {
        oldScreen.set('currentScreen', false);
      }

      newScreen.set('currentScreen', true);
    },

    _currentChar: function() {
      return this.party[this.charIndex];
    },

    _onCharClassSelected: function(e, detail) {
      this.party[this.charIndex].charClass = detail.charClass;
      this.notifyPath('party.' + this.charIndex + '.charClass');
      this.screenChanged('enterName');
    },

    _onCharNameEntered: function(e, detail) {
      this.party[this.charIndex].name = detail.name;
      this.notifyPath('party.' + this.charIndex + '.name');

      if (this.charIndex < 3) {
        this.charIndex++;
        this.screenChanged('charSelect');
      } else {
        this._startGame();
      }
    },

    _onScreenChange: function(e, detail) {
      this.screenChanged(detail.screen);
    },

    _onStartGame: function(e, detail) {
      // TODO: set party from detail.party, for now use default
      this._startGame();
    },

    _startGame: function() {
      this.set('firstCharClass', this.party[0].charClass);
      this.screenChanged('map');
    }

  });