(function(scope) {
  scope.FF = scope.FF || {};

  Polymer({
    is: 'ff-char-selector',
    behaviors: [
      scope.FF.CharClassBehavior
    ],
    properties: {
      charName: {
        type: String
      },
      label: {
        type: String,
        computed: '_labelFor(selected, isReady)'
      },
      selected: {
        notify: true,
        type: String,
        value: ''
      }
    },

    next: function() {
      var index = this._indexOf(this.selected) + 1;
      if (index === this.basicClasses.length) {
        index = 0;
      }
      this.selected = this.basicClasses[index].id;
    },

    prev: function() {
      var index = this._indexOf(this.selected) - 1;
      if (index < 0) {
        index = this.basicClasses.length - 1;
      }
      this.selected = this.basicClasses[index].id;
    },

    _indexOf: function(charClass) {
      return this.CharClasses[charClass || this._defaultCharClass].index;
    },

    _labelFor: function(selectedCharClass) {
      if (!this.isReady) {
        return '';
      }
      return this.CharClasses[selectedCharClass].label;
    },

    ready: function() {
      this._defaultCharClass = this.CharClass.Fighter;
      this.selected = this._defaultCharClass;
      this.isReady = true;
    }
  });
}(window));