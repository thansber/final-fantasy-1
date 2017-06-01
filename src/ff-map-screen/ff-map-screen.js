(function(scope) {
  scope.FF = scope.FF || {};

  Polymer({
    is: 'ff-map-screen',

    behaviors: [
      Polymer.NeonAnimationRunnerBehavior,
      scope.FF.ScreenBehavior
    ],

    properties: {
      animationConfig: {
        value: function() {
          var text = Polymer.dom(this.root).querySelectorAll('p');
          var textArray = Array.prototype.slice.call(text);

          return {
            entry: [{
              name: 'cascaded-animation',
              animation: 'fade-in-animation',
              nodes: textArray,
              nodeDelay: 1250,
              timing: {
                duration: 1000,
                easing: 'steps(4, start)'
              }
            }]
          };
        }
      },

      charClass: {
        readonly: true,
        type: String
      },

      mapId: {
        notify: true,
        type: String
      },

      moving: String,
      shipPosition: {
        readonly: true,
        type: Object
      },
      starting: {
        readonly: true,
        type: Boolean
      },
      transition: {
        observer: '_startingGame',
        type: Object
      },
      transitioning: {
        reflectToAttribute: true,
        type: Boolean
      },
      transports: {
        readonly: true,
        value: Array
      },
      vehicle: {
        readonly: true,
        type: String
      },
      worldMapPosition: {
        readonly: true,
        type: Object
      }
    },

    listeners: {
      'ff-moving-done': '_onMovingDone'
    },

    onScreenClosed: function() {
      //this.cancelAnimation();
    },

    onScreenOpened: function() {
      //this.playAnimation('entry');
    },

    _moveChar: function(direction) {
      // need this check so the map doesn't try to move in
      // multiple directions at once if you press multiple arrow keys
      // at the same time
      if (!this.moving) {
        this.set('moving', direction);
      }
    },

    _moveDown: function() {
      this._moveChar('down');
    },

    _moveLeft: function() {
      this._moveChar('left');
    },

    _moveRight: function() {
      this._moveChar('right');
    },

    _moveUp: function() {
      this._moveChar('up');
    },

    _onMovingDone: function(e, detail) {
      if (!this.transition) {
        return;
      }

      this._transitionAnimation();
    },

    _startingGame: function(transition) {
      if (this.starting) {
        this._toMap(transition);
        this.starting = false;
      }
    },

    _toMap: function(transition) {
      if (transition.toWorldMap) {
        transition = {
          map: 'world',
          y: this.worldMapPosition.y,
          x: this.worldMapPosition.x
        };
      }
      this.mapId = transition.map;
      this.$.map.transitionTo(transition);
    },

    _transitionAnimation: function() {
      var queue = new scope.FF.Animation();
      queue.add(this.set.bind(this, 'transitioning', true, undefined));
      queue.delay(1300);
      queue.add(this._toMap.bind(this, this.transition));
      queue.add(this.set.bind(this, 'transitioning', false, undefined));
      queue.run();
    }
  });

}(window));
