(function(scope) {

  scope.FF = scope.FF || {};

  Polymer({
    is: 'ff-char-select',
    behaviors: [
      scope.FF.CharClassBehavior,
      scope.FF.ScreenBehavior
    ],

    properties: {
      charIndex: {
        readonly: true,
        type: Number
      },
      party: {
        notify: true,
        type: Array
      }
    },

    _charClassFor: function(change, index) {
      return this._charProperty(change, index, 'charClass') || this.CharClass.Fighter;
    },

    _charProperty: function(change, index, property) {
      return this.get(property, change.base[index]);
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