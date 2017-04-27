(function(scope) {
  scope.FF = scope.FF || {};

  Polymer({
    is: 'ff-char-selector',
    behaviors: [
      scope.FF.CharClassBehavior
    ],
    properties: {
      charClassData: {
        type: Array,
        value: function() {
          return [
            { charClass: 'fighter', label: 'FIGHTER' },
            { charClass: 'thief', label: 'THIEF' },
            { charClass: 'blackbelt', label: 'Bl.BELT' },
            { charClass: 'redmage', label: 'RedMAGE' },
            { charClass: 'whitemage', label: 'Wh.MAGE' },
            { charClass: 'blackmage', label: 'Bl.MAGE' }
          ]
        }
      },
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
      if (index === this.basicClasses.length) {
        index = 0;
      }
      this.selected = this.basicClasses[index].charClass;
    },

    prev: function() {
      var index = this._indexOf(this.selected) - 1;
      if (index < 0) {
        index = this.basicClasses.length - 1;
      }
      this.selected = this.basicClasses[index].charClass;
    },

    _byCharClass: function(selectedCharClass, data) {
      return data.charClass === selectedCharClass;
    },

    _indexOf: function(charClass) {
      return this.basicClasses.findIndex(this._byCharClass.bind(this, charClass));
    },

    _labelFor: function(selectedCharClass) {
      return (this.basicClasses.find(this._byCharClass.bind(this, selectedCharClass)) || {}).label;
    }
  });
}(window));