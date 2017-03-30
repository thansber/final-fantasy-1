Polymer({
    is: 'ff-app',

    properties: {
      charIndex: {
        notify: true,
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
            charClass: 'blackbelt',
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
        // TODO: check if 4th char, start game
        console.log('START GAME');
      }
    },

    _onScreenChange: function(e, detail) {
      this.screenChanged(detail.screen);
    }

  });