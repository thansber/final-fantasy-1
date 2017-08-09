
// TODO: screen mixin
class CharSelectElement extends ScreenMixin(CharClassMixin(ReduxMixin(Polymer.Element))) {
  static get is() { return 'ff-char-select'; }

  static get properties() {
    return {
      charIndex: {
        readonly: true,
        type: Number
      },
      party: {
        statePath: 'party',
        type: Array
      }
    };
  }

  _charClassFor(change, index) {
    return this._charProperty(change, index, 'charClass') || this.CharClass.Fighter;
  }

  _charProperty(change, index, property) {
    return this.get(property, change.base[index]);
  }

  _next() {
    this.dispatch({
      type: 'CHAR_CLASS_SET',
      charClass: this._selectedCharSelector().selected,
      charIndex: this.charIndex
    });
  }

  _nextCharClass() {
    this._selectedCharSelector().next();
  }

  _prevCharClass() {
    this._selectedCharSelector().prev();
  }

  _selectedCharSelector() {
    return this.$.selector.selectedItem;
  }
}

customElements.define(CharSelectElement.is, CharSelectElement);
