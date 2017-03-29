(function(scope) {

  scope.FF = scope.FF || {};

   Polymer({
    is: 'ff-opening-menu',

    behaviors: [
      FF.ScreenBehavior
    ],

    properties: {
      respondRate: {
        notify: true,
        type: Number,
        value: 8
      }
    },

    _next: function(e, detail) {
      if (detail.value === 'continue') {
        // TODO: check for existing saved game, load it
        // TODO: if no saved game go to new game
        this.fire('ff-screen', { screen: 'intro' });
      } else if (detail.value === 'new') {
        this.fire('ff-screen', {
          screen: 'charSelect'
        })
      }
    },

    _respondRateChange: function(amount) {
      var newRespondRate = this.respondRate + amount;
      if (newRespondRate < 1) {
        newRespondRate = 8;
      }
      if (newRespondRate > 8) {
        newRespondRate = 1;
      }
      this.set('respondRate', newRespondRate);
    },

    _respondRateLower: function() {
      this._respondRateChange(-1);
    },

    _respondRateRaise: function() {
      this._respondRateChange(1);
    }

  });

 }(window));