class OpeningMenuElement extends ScreenMixin(ReduxMixin(Polymer.Element)) {
  static get is() { return 'ff-opening-menu'; }

  static get properties() {
    return {
      party: {
        type: Object
      },
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

  _loadSavedGame() {
    console.log('TODO: load from actual saved game');
    return [{
      charClass: 'WM',
      name: 'AAAA',
      weapons: [], armor: [], spells: []
    }, {
      charClass: 'Th',
      name: 'BBBB',
      weapons: [], armor: [], spells: []
    }, {
      charClass: 'BB',
      name: 'CCCC',
      weapons: [], armor: [], spells: []
    }, {
      charClass: 'RM',
      name: 'DDDD',
      weapons: [], armor: [], spells: []
    }];
  }

  _next(e, detail) {
    if (detail.value === 'continue') {
      if (this._hasSavedGame()) {
        this.dispatch('LOAD_GAME');
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
