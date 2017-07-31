class KeyHandler extends Polymer.Element {
  static get is() { return 'ff-keyhandler'; }

  activate() {
    this._keyHandlers().forEach((keyHandler) => keyHandler.target = document.body);
  }

  deactivate() {
    this._keyHandlers().forEach((keyHandler) => keyHandler.target = null);
  }

  _back() {
    this._fire('ff-back');
  }

  _fire(eventType) {
    this.dispatchEvent(new CustomEvent(eventType, {bubbles: true, composed: true}));
  }

  _go() {
    this._fire('ff-go');
  }

  _keyHandlers() {
    return this.shadowRoot.querySelectorAll("[keys]");
  }

  _pressedDown() {
    this._fire('ff-down');
  }

  _pressedLeft() {
    this._fire('ff-left');
  }

  _pressedRight() {
    this._fire('ff-right');
  }

  _pressedUp() {
    this._fire('ff-up');
  }
}

customElements.define(KeyHandler.is, KeyHandler);
