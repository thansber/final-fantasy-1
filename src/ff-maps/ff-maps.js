class MapsElement extends ReduxMixin(Polymer.Element) {
  static get is() { return 'ff-maps'; }

  static get properties() {
    return {
      mapId: String,
      mapData: {
        readonly: true,
        type: Object
      },
      mapDefinitions: {
        readonly: true,
        type: Object
      },
      mapSheets: {
        readonly: true,
        type: Object
      }
    };
  }

  static get observers() {
    return [
      '_onMapsLoaded(mapData, mapDefinitions, mapSheets)',
      '_onMapChange(mapId, mapsLoaded)'
    ];
  }

  _buildMap(mapData, e) {
    var map = {
      data: this._parseSprites(mapData.sprites),
      definition: this.mapDefinitions[mapData.definition],
      sheet: e.currentTarget
    };

    map.rows = map.data.length;
    map.cols = map.data[0].length;

    var doNotCopy = /sprites|definition|sheet/;
    var excludeFields = (f) => !doNotCopy.test(f);
    var copyField = (copied, field) => {
      copied[field] = mapData[field];
      return copied;
    };

    Object.assign(map, Object.keys(mapData)
        .filter(excludeFields)
        .reduce(copyField, {}));
    map.transitions = this._transitionsAsMap(mapData.transitions);

    this.dispatch({
      type: 'MAP_LOADED',
      map: map
    });
  }

  _nestedValue(path) {
    var paths = path.split('.');
    return paths.reduce((o, p) => {
      o = o[p] || {};
      return o;
    }, this.mapData);
  }

  _onMapChange(mapId, mapsLoaded) {
    if (!mapId || !mapsLoaded) {
      return;
    }
    var data = this._nestedValue(mapId);
    var sheet = this.mapSheets.sheets[data.sheet];
    var sheetImage = new Image();
    sheetImage.src = sheet;
    sheetImage.onload = e => this._buildMap(data, e);
  }

  _onMapsLoaded(mapData, mapDefinitions, mapSheets) {
    this.mapsLoaded = !!(mapData && mapDefinitions && mapSheets);
  }

  _parseSprites(mapData) {
    return mapData.map(data => data.split(' ').filter(Boolean));
  }

  _transitionsAsMap(transitions) {
    if (!transitions) {
      return {};
    }
    return transitions.reduce((map, transition) => {
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
}

customElements.define(MapsElement.is, MapsElement);
