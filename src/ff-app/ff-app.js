(function(scope) {
  scope.FF = scope.FF || {};

  Polymer({
    is: 'ff-app',

    behaviors: [
      scope.FF.VehicleBehavior
    ],

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
      // The state of the game
      game: {
        notify: true,
        type: Object,
        value: {}
      },
      party: {
        notify: true,
        type: Array,
        value: function() {
          return [{}, {}, {}, {}];
        }
      },
      shop: {
        notify: true,
        type: String
      },
      startGamePosition: {
        readonly: true,
        type: Object,
        value: {
          map: 'world',
          y: 165,
          x: 153
        }
      }
    },

    listeners: {
      'ff-screen': '_onScreenChange',
      'ff-load-game': '_onStartGame'
    },

    ready: function() {
      this.set('game', {
        airshipPosition: {},
        mapPosition: undefined,
        shipPosition: {},
        transports: [this.Vehicles.Foot.id],
        vehicle: this.Vehicles.Foot.id,
        worldMapPosition: undefined
      });
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

    _onEnterShop: function(e, detail) {
      this.set('shop', detail.shop);
      console.log('TODO: add fading animation on screen change');
      this.screenChanged('shop');
    },

    _onSaveWorldMapPosition: function(e, detail) {
      this.set('game.worldMapPosition', {
        y: detail.y,
        x: detail.x
      });
    },

    _onScreenChange: function(e, detail) {
      this.screenChanged(detail.screen);
    },

    _onStartGame: function(e, detail) {
      this.set('party', detail.party);
      console.log('TODO: set game from detail.game');
      this._startGame();
    },

    _onVehicleChange: function(e, detail) {
      if (this.game.vehicle === this.Vehicles.Ship.id) {
        // if leaving ship, record its last position
        this.set('game.shipPosition', detail.leavingPosition);
      }
      this.set('game.vehicle', detail.vehicle);
    },

    _startGame: function() {
      if (!this.game.mapPosition) {
        this.starting = true;
        this.set('game.mapPosition', this.startGamePosition);
      }

      this.set('firstCharClass', this.party[0].charClass);
      this.screenChanged('map');
    }

  });
}(window));