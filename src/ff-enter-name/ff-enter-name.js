class EnterNameElement extends ScreenMixin(Polymer.Element) {
  static get is() { return 'ff-enter-name'; }

  static get properties() {
    return {
      itemsPerRow: {
        type: Number,
        value: 10
      },
      maxChars: {
        type: Number,
        value: 4
      },
      name: {
        type: String,
        value: ''
      }
    };
  }

  cancel(e, detail) {
    if (!this.name.length) {
      return;
    }
    this.name = this.name.substring(0, this.name.length - 1);
  }

  letterSelected(e, detail) {
    if (this.name.length >= this.maxChars) {
      this.dispatchEvent(new CustomEvent('ff-char-name-done', {
        bubbles: true,
        composed: true,
        detail: {
          name: this.name
        }
      }));
      this.name = '';
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
