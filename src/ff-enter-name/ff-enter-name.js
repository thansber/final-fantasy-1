class EnterNameElement extends ScreenMixin(ReduxMixin(Polymer.Element)) {
  static get is() { return 'ff-enter-name'; }

  static get properties() {
    return {
      itemsPerRow: {
        readonly: true,
        type: Number,
        value: 10
      },
      maxNameSize: {
        readonly: true,
        type: Number,
        value: 4
      },
      maxPartySize: {
        readonly: true,
        type: Number,
        value: 4
      },
      name: {
        type: String,
        value: ''
      },
      party: {
        statePath: 'party',
        type: Array
      }
    };
  }

  cancel(e, detail) {
    if (!this.name.length) {
      return;
    }
    this.name = this.name.substring(0, this.name.length - 1);
  }

  isPartyFull() {
    return this.party.length >= this.maxPartySize;
  }

  letterSelected(e, detail) {
    if (this.name.length >= this.maxNameSize) {
      this.dispatch({
        type: 'CHAR_NAME_SET',
        name: this.name
      });
      this.name = '';

      if (this.isPartyFull()) {
        this.dispatch({ type: 'START_GAME' });
      } else {
        this.dispatch('screenChanged', 'charSelect');
      }
      return;
    }
    this.name += detail.value;
  }

  nextLetter() {
    this.$.selector.selectNext();
  }

  nextRow() {
    for (let i = 0; i < this.itemsPerRow; i++) {
      this.nextLetter();
    }
  }

  onScreenClosed() {
    this.$.selector.selected = 'A';
  }

  prevLetter() {
    this.$.selector.selectPrevious();
  }

  prevRow() {
    for (let i = 0; i < this.itemsPerRow; i++) {
      this.prevLetter();
    }
  }
}

customElements.define(EnterNameElement.is, EnterNameElement);
