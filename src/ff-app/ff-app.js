Polymer({
    is: 'ff-app',

    properties: {

    },

    listeners: {
      'ff-screen': '_onScreenChange'
    },

    ready: function() {
      this.screenChanged('intro');
      //this.screenChanged('openingMenu');
      //this.screenChanged('enterName');
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

    _onScreenChange: function(e, detail) {
      this.screenChanged(detail.screen);
    }

  });