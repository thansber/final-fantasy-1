(function(scope) {

  scope.FF = scope.FF || {};

  Polymer({
    is: 'ff-enter-name',
    behaviors: [
      FF.ScreenBehavior
    ],

    properties: {
      itemsPerRow: {
        type: Number,
        value: 10
      }
    },

    nextLetter: function() {
      this.$.selector.selectNext();
    },

    nextRow: function() {
      for (let i = 0; i < this.itemsPerRow; i++) {
        this.nextLetter();
      }
    },

    prevLetter: function() {
      this.$.selector.selectPrevious();
    },

    prevRow: function() {
      for (let i = 0; i < this.itemsPerRow; i++) {
        this.prevLetter();
      }
    }

  });
}(window));