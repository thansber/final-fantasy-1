(function(scope) {

  scope.FF = scope.FF || {};

  Polymer({
    is: 'ff-char-select',
    behaviors: [
      FF.ScreenBehavior
    ],

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