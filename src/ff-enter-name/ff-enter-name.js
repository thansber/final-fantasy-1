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
      },
      maxChars: {
        type: Number,
        value: 4
      },
      name: {
        type: String,
        value: ''
      }
    },

    cancel: function(e, detail) {
      if (!this.name.length) {
        return;
      }
      this.name = this.name.substring(0, this.name.length - 1);
    },

    letterSelected: function(e, detail) {
      if (this.name.length >= this.maxChars) {
        this.fire('ff-char-name-done', {
          name: this.name
        });
        return;
      }
      this.name += detail.value;
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