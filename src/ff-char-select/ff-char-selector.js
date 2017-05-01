(function(scope) {
  scope.FF = scope.FF || {};

  Polymer({
    is: 'ff-char-selector',
    properties: {
      charName: {
        type: String
      },
      label: {
        type: String,
        computed: '_labelFor(selected)'
      },
      selected: {
        notify: true,
        type: String,
        value: 'fighter'
      }
    },

    next: function() {
      var index = this._indexOf(this.selected) + 1;
      if (index === FF.CharClasses.basicClasses.length) {
        index = 0;
      }
      this.selected = FF.CharClasses.basicClasses[index].id;
    },

    prev: function() {
      var index = this._indexOf(this.selected) - 1;
      if (index < 0) {
        index = FF.CharClasses.basicClasses.length - 1;
      }
      this.selected = FF.CharClasses.basicClasses[index].id;
    },

    _indexOf: function(charClass) {
      return FF.CharClasses.basicClassIndex(charClass);
    },

    _labelFor: function(selectedCharClass) {
      return FF.CharClasses.fromId(selectedCharClass).label;
    }
  });
}(window));