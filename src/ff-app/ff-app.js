Polymer({
    is: 'ff-app',

    properties: {
      charIndex: {
        type: Number,
        value: 0
      },
      party: {
        notify: true,
        type: Array,
        value: function() {
          return [{
            charClass: 'fighter',
            name: ''
          }, {
            charClass: 'thief',
            name: ''
          }, {
            charClass: 'blackmage',
            name: ''
          }, {
            charClass: 'redmage',
            name: ''
          }];
        }
      }
    },

    listeners: {
      'ff-screen': '_onScreenChange'
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
      this.screenChanged('enterName');
    },

    _onCharNameEntered: function(e, detail) {
      this.party[this.charIndex].name = detail.name;
      // TODO: check if 4th char, start game
      this.charIndex++;
      this.screenChanged('charSelect');
    },

    _onScreenChange: function(e, detail) {
      this.screenChanged(detail.screen);
    }

  });