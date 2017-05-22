(function(scope) {
  scope.FF = scope.FF || {};

  if (scope.FF.Game) {
    return;
  }

  var transportationByAirship = 'airship';
  var transportationByShip = 'ship';

  FF.Game = {
    hasTransportation: function(transports, passableBy, leavingTileDefinition) {
      if (transports.indexOf(transportationByAirship) > -1) {
        return true;
      }

      if (!passableBy) {
        return false;
      }

      var allowed = transports.indexOf(passableBy) > -1;

      if (transportationByShip === passableBy) {
        allowed = !!leavingTileDefinition.allowsShip;
      }

      return allowed;
    }
  };

  return FF.Game;
}(window));