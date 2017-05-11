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
        readonly: true,
        type: String
      },

      moving: String
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
    }
  });

}(window));
