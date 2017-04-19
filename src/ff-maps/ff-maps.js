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
      this.map = {
        data: this._parseSprites(mapData.sprites),
        definition: this.mapDefinitions[mapData.definition],
        filler: mapData.filler,
        start: mapData.start,
        sheet: e.currentTarget
      };
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
    }

  });

 }(window));