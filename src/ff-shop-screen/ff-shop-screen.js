(function(scope) {

  scope.FF = scope.FF || {};

   Polymer({
    is: 'ff-shop-screen',

    behaviors: [
      scope.FF.ScreenBehavior,
      scope.FF.ShopBehavior
    ],

    properties: {
      gold: {
        readonly: true,
        type: Number
      },
      inventory: {
        readonly: true,
        type: Array
      },
      party: {
        readonly: true,
        type: Array
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
      shopkeepers: {
        readonly: true,
        type: String
      }
    },

    listeners: {
      'ff-selected': '_onSelect',
      'ff-resting': '_onResting'
    },

    observers: [
      '_shopChanged(shop, _isReady)',
      '_stateChanged(_state)'
    ],

    ready: function() {
      this.shopkeepers = this.resolveUrl('shopkeepers.png');
      this._buyingRegex = /buying/i;
      this._exitRegex = /exit/i;
      this._isReady = true;
    },

    _charClassFor: function(change, index) {
      return this.get('charClass', change.base[index]);
    },

    _getPrice: function(thingToBuy) {
      if (this._isInn() || this._isClinic()) {
        return this.inventory[0];
      }


    },

    _isClinic: function() {
      return /clinic/i.test(this.shop);
    },

    _isInn: function() {
      return /inn/i.test(this.shop);
    },

    _onResting: function(e, detail) {
      this.$.party.classList.toggle('resting', detail.resting);
    },

    _onSelect: function(e, detail) {
      var state = this.shopData.states[this._state];

      if (state.to) {
        this.set('_state', state.to);
      } else {
        this.set('_state', this._choices[detail.value].to);
      }
    },

    _padPrice: function(price) {
      var priceStr = '' + price;
      for (var i = priceStr.length; i < 5; i++) {
        priceStr = ' ' + priceStr;
      }
      return priceStr;
    },

    _shopChanged: function(shop) {
      if (!shop || !this._isReady) {
        return;
      }

      this.shopData = this.Shops[shop];

      this.set('_sign', this.shopData.sign);
      this.set('_state', 'start');
    },

    _stateChanged: function() {
      if (!this._state) {
        return;
      }

      if (this._exitRegex.test(this._state)) {
        this.fire('ff-exit-shop');
        return;
      }

      var shopState = this.shopData.states[this._state];

      if (shopState.fire) {
        this.fire(shopState.fire.event, shopState.fire.detail);
      }

      if (this._buyingRegex.test(this._state)) {
        this.set('_conversation', [this._padPrice(this._getPrice(shopState.item)), '', 'Gold', '', 'OK?']);
      } else {
        this.set('_conversation', shopState.conversation);
      }
      this.set('_choices', shopState.choices || []);
      this.set('_noChoices', !this._choices.length);
      this.$.decision.selectIndex(0);
    }

  });

 }(window));