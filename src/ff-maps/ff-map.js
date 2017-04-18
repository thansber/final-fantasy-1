(function(scope) {

  scope.FF = scope.FF || {};

   Polymer({
    is: 'ff-map',

    behaviors: [
      FF.MapBehavior
    ],

    properties: {
      map: Object,
      scale: {
        type: Number,
        value: 16
      }
    },

    observers: [
      '_onMap(map)'
    ],

    ready: function() {
      this.canvas = this.$.canvas;
      this.ctx = this.canvas.getContext("2d");

      this._resizeCanvas(16, 16);
    },

    _drawMap: function() {
      this._resizeCanvas(16, 14);

      var upperLeftX = this.map.start.x - 7;
      var upperLeftY = this.map.start.y - 7;
      var sheet = this.map.sheet;

      for (var y = 0; y < 16; y++) { // for now, treat y like x, even though y uses halves
        for (var x = 0; x < 16; x++) {
          var tile = this._getTile(upperLeftY + y, upperLeftX + x);
          this._drawTile(sheet, {
            x: this.map.definition[tile].x,
            y: this.map.definition[tile].y
          }, {
            x: x,
            y: y
          });
        }
      }
    },

    _drawTile: function(sheet, whereToPullFrom, whereToDraw) {
      this.ctx.drawImage(sheet,
          this.scale * whereToPullFrom.x, // x in source sheet
          this.scale * whereToPullFrom.y, // y in source sheet
          this.scale, // x-scale on source sheet
          this.scale, // y-sacle on source sheet
          this.scale * whereToDraw.x, // x on canvas
          this.scale * whereToDraw.y, // y on canvas
          this.scale,  // x-scale on canvas
          this.scale); // y-sacle on canvas
    },

    _getTile: function(y, x) {
      var row = this.map.data[y];
      if (!row) {
        return this.map.filler;
      }
      return row[x] || this.map.filler;
    },

    _onMap: function(map) {
      this._drawMap();
    },

    _resizeCanvas: function(w, h) {
      var canvasWidth = w * this.scale;
      var canvasHeight = h * this.scale;

      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;
      this.canvas.style.width = canvasWidth + "px";
      this.canvas.style.height = canvasHeight + "px";
    }

  });

 }(window));