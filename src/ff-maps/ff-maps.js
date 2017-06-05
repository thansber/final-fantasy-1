(function(scope) {

  scope.FF = scope.FF || {};

  Polymer({
    is: 'ff-maps',

    behaviors: [
    ],

    properties: {
      mapId: String,
      map: {
        notify: true,
        type: Object
      },

      mapData: Object,
      mapDefinitions: Object,
      mapSheets: Object
    },

    observers: [
      '_onMapsLoaded(mapData, mapDefinitions, mapSheets)',
      '_onMapChange(mapId, mapsLoaded)'
    ],

    _buildMap: function(mapData, e) {
      var map = {
        data: this._parseSprites(mapData.sprites),
        definition: this.mapDefinitions[mapData.definition],
        sheet: e.currentTarget
      };

      map.rows = map.data.length;
      map.cols = map.data[0].length;

      var doNotCopy = /sprites|definition|sheet/;
      var excludeFields = function(f) {
        return !doNotCopy.test(f);
      };
      var copyField = function(copied, field) {
        copied[field] = mapData[field];
        return copied;
      };

      Object.assign(map, Object.keys(mapData)
          .filter(excludeFields)
          .reduce(copyField, {}));
      map.transitions = this._transitionsAsMap(mapData.transitions);
      this.map = map;
    },

    _nestedValue: function(path) {
      var paths = path.split('.');
      return paths.reduce(function(o, p) {
        o = o[p] || {};
        return o;
      }, this.mapData);
    },

    _onMapChange: function(mapId, mapsLoaded) {
      if (!mapsLoaded) {
        return;
      }
      var data = this._nestedValue(mapId);
      var sheet = this.mapSheets.sheets[data.sheet];
      var sheetImage = new Image();
      sheetImage.src = sheet;
      sheetImage.onload = this._buildMap.bind(this, data);
    },

    _onMapsLoaded: function(mapData, mapDefinitions, mapSheets) {
      this.mapsLoaded = true;
    },

    _parseSprites: function(mapData) {
      return mapData.map(function(data) {
        return data.split(' ').filter(Boolean);
      });
    },

    _transitionsAsMap: function(transitions) {
      if (!transitions) {
        return {};
      }
      return transitions.reduce(function(map, transition) {
        var entry = map[transition.y];
        if (!entry) {
          entry = {};
          map[transition.y] = entry;
        }
        entry[transition.x] = {
          to: {
            map: transition.to,
            shop: transition.toShop,
            x: transition.toX,
            y: transition.toY
          }
        };
        return map;
      }, {});
    }

  });

 }(window));