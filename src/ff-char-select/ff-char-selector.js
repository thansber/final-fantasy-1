Polymer({
  is: 'ff-char-selector',
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
    label: {
      type: String,
      computed: '_labelFor(selected)'
    },
    selected: {
      type: String,
      value: 'fighter'
    }
  },

  next: function() {
    var index = this._indexOf(this.selected) + 1;
    if (index === this.charClassData.length) {
      index = 0;
    }
    this.selected = this.charClassData[index].charClass;
  },

  prev: function() {
    var index = this._indexOf(this.selected) - 1;
    if (index < 0) {
      index = this.charClassData.length - 1;
    }
    this.selected = this.charClassData[index].charClass;
  },

  _byCharClass: function(selectedCharClass, data) {
    return data.charClass === selectedCharClass;
  },

  _indexOf: function(charClass) {
    return this.charClassData.findIndex(this._byCharClass.bind(this, charClass));
  },

  _labelFor: function(selectedCharClass) {
    return (this.charClassData.find(this._byCharClass.bind(this, selectedCharClass)) || {}).label;
  }
});