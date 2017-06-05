(function(scope) {

  scope.FF = scope.FF || {};

   Polymer({
    is: 'ff-shop-screen',

    behaviors: [
      scope.FF.ScreenBehavior
    ],

    properties: {
      shop: {
        readonly: true,
        type: String
      }
    }

  });

 }(window));