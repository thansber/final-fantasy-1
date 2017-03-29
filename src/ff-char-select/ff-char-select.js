(function(scope) {

  scope.FF = scope.FF || {};

  Polymer({
    is: 'ff-char-select',
    behaviors: [
      FF.ScreenBehavior
    ],

    properties: {
      party: {
        type: Array
      }
    },

    _next: function() {
      this.fire('ff-char-class-done', {
        charClass: this._selectedCharSelector().selected
      });
    },

    _nextCharClass: function() {
      this._selectedCharSelector().next();
    },

    _prevCharClass: function() {
      this._selectedCharSelector().prev();
    },

    _selectedCharSelector: function() {
      return this.$.selector.selectedItem;
    }

  });
}(window));