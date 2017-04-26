(function(scope) {

  scope.FF = scope.FF || {};

   Polymer({
    is: 'ff-map',

    behaviors: [
      FF.MapBehavior
    ],

    properties: {
      FPS: {
        type: Number,
        value: 40
      },
      map: Object,
      moving: String, // one of up|down|left|right
      positionX: {
        notify: true,
        type: Number
      },
      positionY: {
        notidy: true,
        type: Number
      },
      scale: {
        type: Number,
        value: 16
      }
    },

    observers: [
      '_onMap(map)',
      '_onMove(moving)',
      '_onPosition(positionY, positionX)'
    ],

    ready: function() {
      this.canvas = this.$.canvas;
      this.ctx = this.canvas.getContext("2d");

      this.moveOptions = {
        up: {
          xChange: 0,
          yChange: -1,
          xExtraTiles: 0,
          xUpperLeftAdjustment: 0,
          yExtraTiles: 1,
          yUpperLeftAdjustment: 0
        },
        down: {
          xChange: 0,
          yChange: 1,
          xExtraTiles: 0,
          xUpperLeftAdjustment: 0,
          yExtraTiles: 1,
          yUpperLeftAdjustment: -1
        },
        right: {
          xChange: 1,
          yChange: 0,
          xExtraTiles: 1,
          xUpperLeftAdjustment: -1,
          yExtraTiles: 0,
          yUpperLeftAdjustment: 0
        },
        left: {
          xChange: -1,
          yChange: 0,
          xExtraTiles: 1,
          xUpperLeftAdjustment: 0,
          yExtraTiles: 0,
          yUpperLeftAdjustment: 0
        }
      };

      this._resizeCanvas(16, 16);
    },

    _adjustPosition: function(yChange, xChange) {
      this.positionX += xChange;
      this.positionY += yChange;
    },

    _drawMap: function() {
      this.positionX = this.map.start.x;
      this.positionY = this.map.start.y;
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

    _moveOnePixel: function(options) {
      var upperLeftX = this.positionX - (this.scale / 2 - 1) + options.xUpperLeftAdjustment;
      var upperLeftY = this.positionY - (this.scale / 2 - 1) + options.yUpperLeftAdjustment;

      for (var y = 0, yMax = this.scale + options.yExtraTiles; y < yMax; y++) {
        for (var x = 0, xMax = this.scale + options.xExtraTiles; x < xMax; x++) {
          this._drawTile(
            this.map.sheet,
            this._tileCoords(upperLeftY + y, upperLeftX + x),
            { x: x - options.xAdjustment, y: y - options.yAdjustment }
          );
        }
      }
    },

    _onMap: function(map) {
      this._drawMap();
    },

    _onMove: function(direction) {
      if (direction) {
        var pixelsMoved = 1;
        var moveId;
        var directionOptions = Object.assign({}, this.moveOptions[direction]);

        this._adjustPosition(directionOptions.yChange, directionOptions.xChange);

        // TODO: check for map transition
        // TODO: confirm new position is passable

        var moveLoop = function() {
          switch (direction) {
            case 'up':
              directionOptions.xAdjustment = 0;
              directionOptions.yAdjustment = parseFloat(1 - pixelsMoved / this.scale);
              break;
            case 'down':
              directionOptions.xAdjustment = 0;
              directionOptions.yAdjustment = parseFloat(pixelsMoved / this.scale);
              break;
            case 'left':
              directionOptions.xAdjustment = parseFloat(1 - pixelsMoved / this.scale);
              directionOptions.yAdjustment = 0;
              break;
            case 'right':
              directionOptions.xAdjustment = parseFloat(pixelsMoved / this.scale);
              directionOptions.yAdjustment = 0;
              break;
            default:
              throw 'Invalid direction: [' + direction + ']';
          }

          this._moveOnePixel(directionOptions);
          pixelsMoved++;

          if (pixelsMoved > this.scale) {
            clearInterval(moveId);
            this.moving = null;
            this._onMovingDone(directionOptions);
          }
        };

        moveId = setInterval(moveLoop.bind(this), 1000 / this.FPS);
      }
    },

    _onMovingDone: function(directionOptions) {

    },

    _onPosition: function(posY, posX) {
      if (this.moving) {
        return;
      }

      this._resizeCanvas(16, 14);

      var upperLeftX = this.positionX - 7;
      var upperLeftY = this.positionY - 7;
      var sheet = this.map.sheet;

      for (var y = 0; y < 16; y++) { // for now, treat y like x, even though y uses halves
        for (var x = 0; x < 16; x++) {
          this._drawTile(sheet, this._tileCoords(upperLeftY + y, upperLeftX + x), { x: x, y: y });
        }
      }
    },

    _resizeCanvas: function(w, h) {
      var canvasWidth = w * this.scale;
      var canvasHeight = h * this.scale;

      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;
      this.canvas.style.width = canvasWidth + "px";
      this.canvas.style.height = canvasHeight + "px";
    },

    _tileCoords: function(y, x) {
      var tile = this._getTile(y, x);
      return {
        x: this.map.definition[tile].x,
        y: this.map.definition[tile].y
      };
    }

  });

 }(window));