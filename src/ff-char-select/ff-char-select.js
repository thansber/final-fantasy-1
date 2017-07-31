((scope) => {

  scope.FF = scope.FF || {};

  const CharClassMixin = scope.FF.CharClassMixin;
  // TODO: screen mixin

  class CharSelectElement extends CharClassMixin(Polymer.Element) {
    static get is() { return 'ff-char-select'; }

    static get properties() {
      return {
        charIndex: {
          readonly: true,
          type: Number
        },
        party: {
          notify: true,
          type: Array
        }
      };
    }

    _charClassFor(change, index) {
      return this._charProperty(change, index, 'charClass') || this.CharClass.Fighter;
    },

    _charProperty(change, index, property) {
      return this.get(property, change.base[index]);
    },

    _next() {
      this.fire('ff-char-class-done', {
        charClass: this._selectedCharSelector().selected
      });
    },

    _nextCharClass() {
      this._selectedCharSelector().next();
    },

    _prevCharClass() {
      this._selectedCharSelector().prev();
    },

    _selectedCharSelector() {
      return this.$.selector.selectedItem;
    }
  }

  customElements.define(CharSelectElement.is, CharSelectElement);
}(window));