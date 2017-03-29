(function(scope) {
  scope.FF = scope.FF || {};

  Polymer({
    is: 'ff-intro',

    behaviors: [
      Polymer.NeonAnimationRunnerBehavior,
      FF.ScreenBehavior
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
      }
    },

    onScreenClosed: function() {
      this.cancelAnimation();
    },

    onScreenOpened: function() {
      this.playAnimation('entry');
    },

    _toMenu: function() {
      this.fire('ff-screen', {
        screen: 'openingMenu'
      });
    }
  });

}(window));
