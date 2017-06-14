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
      'ff-selected': '_onSelect'
    },

    observers: [
      '_shopChanged(shop, _isReady)',
      '_stateChanged(_state)'
    ],

    ready: function() {
      this.shopkeepers = this.resolveUrl('shopkeepers.png');
      this._exitRegex = /exit/i;
      this._isReady = true;
    },

    _onSelect: function(e, detail) {
      var state = this.shopData.states[this._state];
      if (state.to) {
        this.set('_state', state.to);
      } else {
        this.set('_state', this._choices[detail.value].to);
      }
    },

    _parseChoice: function(choice) {
      if (this._nextRegex.test(choice)) {
        this._onNext();
      } else if (this._prevRegex.test(choice)) {
        this._onPrev();
      }
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
        console.log('TODO: EXITING SHOP');
        return;
      }
      this.set('_conversation', this.shopData.states[this._state].conversation);
      this.set('_choices', this.shopData.states[this._state].choices || []);
      this.set('_noChoices', !this._choices.length);
      this.$.decision.selectIndex(0);
    }

  });

 }(window));