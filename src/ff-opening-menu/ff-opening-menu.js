class OpeningMenuElement extends ScreenMixin(ReduxMixin(Polymer.Element)) {
  static get is() { return 'ff-opening-menu'; }

  static get properties() {
    return {
      respondRate: {
        notify: true,
        type: Number,
        value: 6
      }
    };
  }

  _hasSavedGame() {
    console.log('TODO: check for existing saved game');
    return true;
  }

  _next(e, detail) {
    if (detail.value === 'continue') {
      if (this._hasSavedGame()) {
        this.dispatch({ type: 'LOAD_GAME' });
        return;
      }
      this.dispatch('screenChanged', 'charSelect');
    } else if (detail.value === 'new') {
      this.dispatch('screenChanged', 'charSelect');
    }
  }

  _respondRateChange(amount) {
    var newRespondRate = this.respondRate + amount;
    if (newRespondRate < 1) {
      newRespondRate = 8;
    }
    if (newRespondRate > 8) {
      newRespondRate = 1;
    }
    this.set('respondRate', newRespondRate);
  }

  _respondRateLower() {
    this._respondRateChange(-1);
  }

  _respondRateRaise() {
    this._respondRateChange(1);
  }
}

customElements.define(OpeningMenuElement.is, OpeningMenuElement);
