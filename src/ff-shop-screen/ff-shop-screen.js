class ShopScreenElement extends CharClassMixin(ScreenMixin(ReduxMixin(Polymer.Element))) {
  static get is() { return 'ff-shop-screen'; }

  static get properties() {
    return {
      charInventory: {
        type: Array
      },
      charItems: {
        notify: true,
        type: Array
      },
      deadChars: {
        statePath: 'deadChars',
        type: Array
      },
      gold: {
        statePath: 'gold',
        type: Number
      },
      party: {
        statePath: 'party',
        type: Object
      },
      partyInventoryKey: {
        statePath: 'shop.partyInventoryKey',
        type: String
      },
      shopChoices: {
        type: Array
      },
      shopInventory: {
        statePath: 'shop.inventory',
        type: Array
      },
      shop: {
        readonly: true,
        statePath: 'shop.type',
        type: String
      },
      shopkeeperSays: {
        type: Array,
        value: ['Welcome', '  ::', 'Stay,', 'to save', 'your', 'data.']
      },
      sign: {
        statePath: 'shop.sign',
        type: String
      },
      state: Object,
      stateId: {
        notify: true,
        type: String
      },
      transaction: {
        readonly: true,
        type: Object
      }
    };
  }

  static get observers() {
    return [
      '_stateChanged(state, shop)'
    ];
  }

  constructor() {
    super();
    this._errorHandlers = {
      alreadyKnowsSpell: () =>
        this._getAllKnownSpells().indexOf(this.transaction.item.name) > -1
          ? 'alreadyKnowsSpell' : '',
      anyoneDead: () => this.deadChars.length ? '' : 'nobodyDead',
      anythingToSell: () =>
        this._getCharInventory().length ? '' : 'nothingToSell',
      canLearnSpell: () => {
        const allowedClasses = this.transaction.item.allowedClasses;
        const charClass = this.transaction.forChar.charClass;
        return this.containsCharClass(allowedClasses, charClass) ? '' : 'cannotLearnSpell';
      },
      money: () =>
        this.transaction.item.price > this.gold ? 'notEnoughMoney' : '',
      room: () =>
        this._getCharInventory().length >= this.state.maxAllowed ? 'notEnoughRoom' : '',
      roomForSpell: () =>
        this._getKnownSpellsForLevel().length >= this.state.maxAllowed ? 'notEnoughRoom' : ''
    }
  }

  primaryKeyHandler() {
    this._currentSelector = this.$.shopDecision;
    return this._currentSelector.keyHandler();
  }

  _buildChoices(state) {
    if (state.charNameChoices) {
      return this.party.map(c => ({ label: c.name }));
    } else if (state.deadCharChoices) {
      return this.deadChars.map(c => ({ label: c }));
    }
    return state.choices || [];
  }

  _charInventorySelected(e, detail) {
    this.transaction.item = Object.assign({}, this.charInventory[detail.value]);
    this._nextState();
  }

  _choiceSelected(e, detail) {
    if (this.state.charNameChoices) {
      this.transaction.forChar = this.party[detail.value];
    }
    if (this.state.deadCharChoices) {
      this.transaction.forChar =
        this.party.filter(c => c.name === this.deadChars[detail.value])[0];
    }
    if (this.state.singleItem) {
      this.transaction.item = { price: this.shopInventory[0] };
    }
    this._nextState(detail.value);
  }

  _errorState(checks) {
    return (checks || []).reduce((err, checkId) => err || this._errorHandlers[checkId](), '');
  }

  _getAllKnownSpells() {
    return this._getCharInventory().reduce((a, b) => a.concat(b), []);
  }

  _getCharInventory() {
    return this.transaction.forChar[this.partyInventoryKey];
  }

  _getKnownSpellsForLevel() {
    return this._getCharInventory()[this.transaction.item.level - 1] || [];
  }

  _getPrice(state) {
    if (state.singleItem) {
      return this.shopInventory[0];
    }

    return this._currentSelector.selectedItem().getAttribute('price')
  }

  _inventorySelected(e, detail) {
    this.transaction.item = Object.assign({}, this.shopInventory[detail.value]);
    this._nextState();
  }

  _nextState(choice) {
    const stateChoice = this.shopChoices[choice] || {};
    let errorState = this._errorState(this.state.transactionChecks);

    if (!errorState && this.state.finishTransaction) {
      this.dispatch({
        type: 'SHOP_TRANSACTION',
        transaction: this.transaction
      });
    }

    if (stateChoice.back) {
      errorState = '';
    }

    const nextStateId = errorState || this.state.to || stateChoice.to;
    this.set('stateId', nextStateId);
  }

  _padPrice(price) {
    return Array.from(Array(5 - ('' + price).length)).map(i => ' ').join('') + price;
  }

  _previousState() {
    if (this.state.back) {
      this.set('stateId', this.state.back);
    }
  }

  _shopkeeperSaysPrice(price) {
    this.set('shopkeeperSays', [this._padPrice(price), '', 'Gold', '', 'OK?']);
    this._switchKeyHandler(this.$.shopDecision);
  }

  _stateChanged(state, shop) {
    if (!shop || !state) {
      return;
    }

    if (state.exit) {
      this.dispatch({ type: 'EXIT_SHOP' });
      return;
    }

    if (state.resting) {
      this.dispatch({ type: 'RESTED_AT_INN' });
    }

    if (state.reset) {
      this.transaction = { shop: this.shop };
    }

    if (state.sale) {
      this.transaction.sale = true;
    }

    if (state.showCharInventory) {
      this.set('charItems', this._getCharInventory());
    }

    let errorState = this._errorState(this.state.initialChecks);
    if (errorState) {
      this._nextState(errorState);
      return;
    }

    if (state.askForPrice) {
      this._shopkeeperSaysPrice(this._getPrice(state));
    } else {
      this.set('shopkeeperSays', state.conversation);
    }

    this._switchKeyHandler(state.inventoryActive);
    this.set('shopChoices', this._buildChoices(state));
  }

  _switchKeyHandler(selectorType) {
    const newSelector = {
      'shop': this.$.shopInventory,
      'char': this.$.charInventory
    }[selectorType] || this.$.shopDecision;

    if (this._currentSelector) {
      this._currentSelector.deactivate();
    }
    newSelector.activate();
    this._currentSelector = newSelector;
  }
}

customElements.define(ShopScreenElement.is, ShopScreenElement);
