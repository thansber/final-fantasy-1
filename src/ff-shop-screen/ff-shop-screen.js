class ShopScreenElement extends ScreenMixin(ReduxMixin(Polymer.Element)) {
  static get is() { return 'ff-shop-screen'; }

  static get properties() {
    return {
      gold: {
        statePath: 'gold',
        type: Number
      },
      party: {
        statePath: 'party',
        type: Object
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
        reflectToAttribute: true,
        statePath: 'shop.type',
        type: String
      },
      shopkeeperSays: {
        type: Array,
        value: ['Welcome', '  ::', 'Stay,', 'to save', 'your', 'data.']
      },
      shopkeepersUrl: {
        readonly: true,
        type: String
      },
      state: {
        observer: '_stateChanged',
        type: Object
      },
      stateId: {
        notify: true,
        type: String
      }
    };
  }

  ready() {
    super.ready();
    this.shopkeepersUrl = this.resolveUrl('shopkeepers.png');
  }

  _buildChoices(state) {
    if (state.charNameChoices) {
      return this.party.map(c => ({ label: c.name }));
    }
    return state.choices || [];
  }

  _choiceSelected(e, detail) {
    this._nextState(detail.value);
  }

  _getPrice(state) {
    if (state.singleItem) {
      return this.shopInventory[0];
    }

    return this.$.inventorySelector.selectedItem.getAttribute('price')
  }

  _nextState(choice) {
    if (this.state.to) {
      this.set('stateId', this.state.to);
    } else {
      this.set('stateId', this.shopChoices[choice].to);
    }
  }

  _padPrice(price) {
    return Array.from(Array(5 - ('' + price).length)).map(i => ' ').join('') + price;
  }

  _shopkeeperSaysPrice(price) {
    this.set('shopkeeperSays', [this._padPrice(price), '', 'Gold', '', 'OK?']);
    this._switchKeyHandler(this.$.shopDecision);
  }

  _stateChanged(state) {
    this.showInventory = false;

    if (state.exit) {
      this.dispatch({ type: 'EXIT_SHOP' });
      return;
    }

    if (state.resting) {
      this.dispatch({ type: 'RESTED_AT_INN' });
    }

    if (state.askForPrice) {
      //this._setTransactionItem(this._shopInventory);
      this._shopkeeperSaysPrice(this._getPrice(state));
    } else {
      this.set('shopkeeperSays', state.conversation);
    }

    this._switchKeyHandler(state.inventoryActive
        ? this.$.shopInventory
        : this.$.shopDecision);

    this.set('shopChoices', this._buildChoices(state));
  }

  _switchKeyHandler(newSelector) {
    if (this._currentSelector) {
      newSelector.deactivate();
    }
    newSelector.activate();
    this._currentSelector = newSelector;
  }

}

customElements.define(ShopScreenElement.is, ShopScreenElement);
/*
(function(scope) {

  scope.FF = scope.FF || {};

   Polymer({
    is: 'ff-shop-screen',

    behaviors: [
      scope.FF.ScreenBehavior,
      scope.FF.CharClassBehavior,
      scope.FF.ShopBehavior
    ],

    properties: {
      charInventoryKey: {
        readonly: true,
        type: String
      },
      gold: {
        readonly: true,
        type: Number
      },
      party: {
        readonly: true,
        type: Array
      },
      transaction: {
        readonly: true,
        type: Object,
        value: function() {
          return {};
        }
      },
      shop: {
        readonly: true,
        reflectToAttribute: true,
        type: String
      },
      shopData: {
        readonly: true,
        type: Object
      },
      shopItems: {
        readonly: true,
        type: Array
      },
      shopkeepers: {
        readonly: true,
        type: String
      }
    },

    listeners: {
      'ff-back': '_onBack',
      'ff-selected': '_onSelect',
      'ff-resting': '_onResting'
    },

    observers: [
      '_shopChanged(shop, _isReady)',
      '_stateChanged(_state)'
    ],

    ready: function() {
      this.shopkeepers = this.resolveUrl('shopkeepers.png');
      this._showingInventory = false;
      this._isReady = true;
    },

    primaryKeyHandler: function() {
      this._currentSelector = this.$.decision;
      return this.$.decision.$.keyHandler;
    },

    _alreadyKnowsSpell: function() {
      return this.party[this.transaction.forChar].spells.indexOf(this.transaction.item.name) > -1;
    },

    _buildState: function(stateId) {
      var shopState = this.shopData.states[stateId];
      if (!shopState) {
        throw 'No state found for shop [' + this.shop + '], state [' + stateId + ']';
      }
      if (shopState.copyFrom) {
        shopState = Object.assign({}, this.shopData.states[shopState.copyFrom], shopState);
      }
      return shopState;
    },

    _canAfford: function() {
      return this.gold >= +this.transaction.item.price;
    },

    _canLearnSpell: function() {
      var allowedClasses = this.transaction.item.allowedClasses;
      var charClass = this.party[this.transaction.forChar].charClass;
      return this.containsCharClass(allowedClasses, charClass);
    },

    _charClassFor: function(change, index) {
      return this.get('charClass', change.base[index]);
    },

    _charHasInventory: function() {
      return !!this._getCharInventory().length;
    },

    _getCharInventory: function() {
      if (this.transaction.partyInventory) {
        return this.partyInventory;
      }
      return this.party[this.transaction.forChar][this.charInventoryKey];
    },

    _getPrice: function() {
      if (this._isInn() || this._isClinic()) {
        return this.shopItems[0];
      }

      return this.$.inventorySelector.selectedItem.getAttribute('price')
    },

    _hasRoom: function() {
      var numItemsOwned = this._getCharInventory().length;
      var maxOwnedAllowed = this.shopData.maxOwned || 99;
      return numItemsOwned < maxOwnedAllowed;
    },

    _isClinic: function() {
      return /clinic/i.test(this.shop);
    },

    _isExiting: function() {
      return /exit/i.test(this._state);
    },

    _isInn: function() {
      return /inn/i.test(this.shop);
    },

    _isPurchaseOk: function() {
      if (this.transaction.selling) {
        return true;
      }

      if (!this._canAfford()) {
        this.set('_state', 'notEnoughMoney');
        return false;
      }
      if (!this._hasRoom()) {
        this.set('_state', 'notEnoughRoom');
        return false;
      }

      return true;
    },

    _itemLevel: function(item) {
      if (!item.level) {
        return '';
      }
      return 'L' + item.level;
    },

    _loadCharInventory: function() {
      var selling = this._getCharInventory().map(function(item) {
        return Object.assign({}, item, {
          price: Math.floor(item.price / 2)
        });
      });
      this.set('_shopInventory', selling);
    },

    _onBack: function(e, detail) {
      var state = this.shopData.states[this._state];
      if (state.back) {
        this.set('_state', state.back);
      }
    },

    _onResting: function(e, detail) {
      this.$.party.classList.toggle('resting', detail.resting);
    },

    _onSelect: function(e, detail) {
      var state = this._buildState(this._state);

      if (state.confirmForChar) {
        this.transaction.forChar = detail.value;
      }

      if (state.finishTransaction) {
        if (this._isPurchaseOk()) {
          this.fire('ff-purchase', this.transaction);
          this._updateState(state, detail.value);
        }
      } else if (state.checkCharInventory) {
        if (!this._charHasInventory()) {
          this.set('_state', 'nothingToSell');
        } else {
          this.set('_state', state.to);
        }
      } else if (state.spellCheck) {
        this._setTransactionItem(this._shopInventory);
        if (!this._canLearnSpell()) {
          this.set('_state', 'cannotLearnSpell');
        } else if (this._alreadyKnowsSpell()) {
          this.set('_state', 'alreadyKnowsSpell');
        } else {
          this.set('_state', state.to);
        }
      } else {
        this._updateState(state, detail.value);
      }
    },

    _padPrice: function(price) {
      var priceStr = '' + price;
      for (var i = priceStr.length; i < 5; i++) {
        priceStr = ' ' + priceStr;
      }
      return priceStr;
    },

    _partyNames: function() {
      return this.party.map(function(c) {
        return { label: c.name };
      });
    },

    _setTransactionItem: function(inventory) {
      this.transaction.item = inventory[this.$.inventorySelector.selected];
    },

    _setupChoices: function(shopState) {
      if (shopState.charNameChoices) {
        this.set('_choices', this._partyNames());
      } else {
        this.set('_choices', shopState.choices || []);
      }

      this.set('_noChoices', !this._choices.length);
    },

    _setupPriceConfirmation: function(price) {
      this.set('_conversation', [this._padPrice(price), '', 'Gold', '', 'OK?']);
      this._switchKeyHandler(this.$.decision);
    },

    _shopChanged: function(shop) {
      if (!shop || !this._isReady) {
        return;
      }

      this.set('_state', undefined);
      this.shopData = this.Shops[shop];

      this.set('_sign', this.shopData.sign);
      this.set('_state', 'start');
    },

    _stateChanged: function() {
      if (!this._state) {
        return;
      }

      this._showingInventory = false;

      if (this._isExiting()) {
        this.fire('ff-exit-shop');
        this.set('shop', undefined);
        return;
      }

      var shopState = this._buildState(this._state);

      if (shopState.fire) {
        this.fire(shopState.fire.event, shopState.fire.detail);
      }

      if (shopState.loadCharInventory) {
        this._loadCharInventory();
      }

      if (shopState.showInventory) {
        this._showingInventory = true;
      }

      if (shopState.reset) {
        this.transaction = {
          partyInventory: shopState.partyInventory,
          shop: this.shop
        };
      }

      if (shopState.transactionSelling) {
        this.transaction.selling = true;
      }

      if (shopState.askForPrice) {
        this._setTransactionItem(this._shopInventory);
        this._setupPriceConfirmation(this._getPrice());
      } else {
        this.set('_conversation', shopState.conversation);
      }

      this._switchKeyHandler(shopState.inventoryActive
        ? this.$.inventorySelector
        : this.$.decision);

      this._setupChoices(shopState);
    },

    _switchKeyHandler: function(newSelector) {
      if (this._currentSelector) {
        this._currentSelector.selected = null;
        this._currentSelector.$.keyHandler.deactivate();
      }
      newSelector.$.keyHandler.activate();
      newSelector.selectIndex(0);
      this._currentSelector = newSelector;
    },

    _updateState: function(shopState, selectedChoice) {
      this.set('_state', shopState.to ? shopState.to : this._choices[selectedChoice].to);
    }

  });

 }(window));
*/