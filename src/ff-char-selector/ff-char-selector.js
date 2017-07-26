class CharSelectorElement extends CharClassMixin(Polymer.Element) {
  static get is() { return 'ff-char-selector'; }

  static get properties() {
    return {
      charName: {
        type: String
      },
      label: {
        type: String,
        computed: '_labelFor(selected, _isReady)'
      },
      selected: {
        notify: true,
        type: String,
        value: ''
      }
    };
  }

  next() {
    let index = this._indexOf(this.selected) + 1;
    if (index === this.basicClasses.length) {
      index = 0;
    }
    this.selected = this.basicClasses[index].id;
  }

  prev() {
    var index = this._indexOf(this.selected) - 1;
    if (index < 0) {
      index = this.basicClasses.length - 1;
    }
    this.selected = this.basicClasses[index].id;
  }

  ready() {
    super.ready();
    this._defaultCharClass = this.CharClass.Fighter;
    this.selected = this._defaultCharClass;
    this._isReady = true;
  }

  _indexOf(charClass) {
    return this.CharClasses[charClass || this._defaultCharClass].index;
  }

  _labelFor(selectedCharClass) {
    if (!this._isReady) {
      return '';
    }
    return this.CharClasses[selectedCharClass].label;
  }
}

customElements.define(CharSelectorElement.is, CharSelectorElement);
