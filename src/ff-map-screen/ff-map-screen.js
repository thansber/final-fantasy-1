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

    _moveDown: function() {
      this.set('moving', 'down');
    },

    _moveLeft: function() {
      this.set('moving', 'left');
    },

    _moveRight: function() {
      this.set('moving', 'right');
    },

    _moveUp: function() {
      this.set('moving', 'up');
    }
  });

}(window));
