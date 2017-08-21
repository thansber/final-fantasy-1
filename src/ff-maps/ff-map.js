((scope) => {

  scope.FF = scope.FF || {};

  class MapElement extends MapMixin(ReduxMixin(Polymer.Element)) {
    static get is() { return 'ff-map'; }

    static get properties() {
      return {
        FPS: {
          readonly: true,
          type: Number
        },
        movableId: {
          statePath: 'movableId',
          type: String
        },
        moveOptions: {
          readonly: true,
          type: Object,
          value: () => this.moveOptions = {
            up: {
              xChange: 0,
              yChange: -1,
              xExtraTiles: 0,
              xUpperLeftAdjustment: 0,
              yExtraTiles: 1,
              yUpperLeftAdjustment: 0,
              xAdjustment: 0,
              calculateAdjustment: (pixelsMoved, scale) => ({
                yAdjustment: parseFloat(1 - pixelsMoved / scale)
              })
            },
            down: {
              xChange: 0,
              yChange: 1,
              xExtraTiles: 0,
              xUpperLeftAdjustment: 0,
              yExtraTiles: 1,
              yUpperLeftAdjustment: -1,
              xAdjustment: 0,
              calculateAdjustment: (pixelsMoved, scale) => ({
                yAdjustment: parseFloat(pixelsMoved / scale)
              })
            },
            right: {
              xChange: 1,
              yChange: 0,
              xExtraTiles: 1,
              xUpperLeftAdjustment: -1,
              yExtraTiles: 0,
              yUpperLeftAdjustment: 0,
              yAdjustment: 0,
              calculateAdjustment: (pixelsMoved, scale) => ({
                xAdjustment: parseFloat(pixelsMoved / scale)
              })
            },
            left: {
              xChange: -1,
              yChange: 0,
              xExtraTiles: 1,
              xUpperLeftAdjustment: 0,
              yExtraTiles: 0,
              yUpperLeftAdjustment: 0,
              yAdjustment: 0,
              calculateAdjustment: (pixelsMoved, scale) => ({
                xAdjustment: parseFloat(1 - pixelsMoved / scale)
              })
            }
          }
        },
        moving: {
          observer: '_onMoving',
          statePath: 'moving',
          type: Array // contains one of up|down|left|right
        },
        numTiles: { // number of tiles shown across/down
          readonly: true,
          type: Number,
          value: 16
        },
        sheetIconSize: {
          readonly: true,
          type: Number,
          value: 32
        }
      };
    }

    static get observers() {
      return [
        '_onPosition(map, positionX, positionY)'
      ];
    }

    ready() {
      super.ready();

      this.canvas = new scope.FF.Canvas(this.$.canvas);
      this.canvas.resize(this.canvas, this.numTiles, this.numTiles);

      this.FPS = this.canvas.scale / 16 * 40;
    }

    _drawTile(sheet, whereToPullFrom, whereToDraw) {
      this.canvas.ctx.drawImage(sheet,
          this.sheetIconSize * whereToPullFrom.x, // x in source sheet
          this.sheetIconSize * whereToPullFrom.y, // y in source sheet
          this.sheetIconSize, // x-scale on source sheet
          this.sheetIconSize, // y-sacle on source sheet
          this.canvas.scale * whereToDraw.x, // x on canvas
          this.canvas.scale * whereToDraw.y, // y on canvas
          this.canvas.scale,  // x-scale on canvas
          this.canvas.scale); // y-sacle on canvas
    }

    _findTransition(y, x) {
      if (this.map.exitOnOutOfBounds && this._isOutOfBounds(y, x)) {
        return { toWorldMap: true };
      }
      var transitionsForY = this.map.transitions[y] || {};
      var transitions = transitionsForY[x] || {};
      return transitions.to;
    }

    _isOutOfBounds(y, x) {
      if (y < 0 || x < 0) {
        return true;
      }
      return y >= this.map.rows || x >= this.map.cols;
    }

    _move(directionOptions) {
      let pixelsMoved = 1;
      let moveId;

      // already determined that we can move, scrolls map to new position
      // and starts walk animation
      const moveLoop = () => {
        this._redrawMap(Object.assign(
          {},
          directionOptions,
          directionOptions.calculateAdjustment(pixelsMoved, this.canvas.scale)
        ));
        pixelsMoved++;

        if (pixelsMoved > this.canvas.scale) {
          clearInterval(moveId);
          this.dispatch({ type: 'STOP_MOVING' });
          this._onMovingDone();
        }
      };

      moveId = setInterval(moveLoop.bind(this), 1000 / this.FPS);
      this.$.moving.walk();
    }

    _onMoving(direction) {
      if (!direction.length || direction.length > 1) {
        return;
      }

      this.facing = direction[0];
      this.transition = null;

      const directionOptions = this.moveOptions[direction[0]];
      const goingToPosition = {
        x: this.positionX + directionOptions.xChange,
        y: this.positionY + directionOptions.yChange
      };

      if (this.isPassable(goingToPosition)) {
        // TODO: dispatch action if there is a transition
        //this.set('transition', this._getTransition(this.positionY, this.positionX));
        this.dispatch({
          type: 'POSITION_CHANGED',
          x: goingToPosition.x,
          y: goingToPosition.y
        });

        this._move(directionOptions);
      } else {
        this.dispatch({ type: 'STOP_MOVING' });
        return;
      }
    }

    _onMovingDone() {
      const transition = this._findTransition(this.positionY, this.positionX);
      if (transition) {
        this.dispatch({
          type: 'MAP_TRANSITION',
          transition: transition
        });
      }
    }

    _onPosition(map, posX, posY) {
      if ((this.moving && this.moving.length)
        || !map
        || isNaN(parseInt(posY, 10))
        || isNaN(parseInt(posX, 10))) {
        return;
      }

      this.canvas.resize(this.numTiles, this.numTiles - 2);

      var upperLeftX = this.positionX - 7;
      var upperLeftY = this.positionY - 7;
      var sheet = this.map.sheet;

      if (this.map.wrapsX && upperLeftX < 0) {
        upperLeftX += this.map.cols;
      }
      if (this.map.wrapsY && upperLeftY < 0) {
        upperLeftY += this.map.rows;
      }

      for (var y = 0; y < this.numTiles; y++) { // for now, treat y like x, even though y uses halves
        for (var x = 0; x < this.numTiles; x++) {
          this._drawTile(sheet, this._tileCoords(upperLeftY + y, upperLeftX + x), { x: x, y: y });
        }
      }
    }

    _redrawMap(options) {
      const upperLeftX = this.positionX - (this.numTiles / 2 - 1) + options.xUpperLeftAdjustment;
      const upperLeftY = this.positionY - (this.numTiles / 2 - 1) + options.yUpperLeftAdjustment;

      for (let y = 0, yMax = this.numTiles + options.yExtraTiles; y < yMax; y++) {
        for (let x = 0, xMax = this.numTiles + options.xExtraTiles; x < xMax; x++) {
          this._drawTile(
            this.map.sheet,
            this._tileCoords(upperLeftY + y, upperLeftX + x),
            { x: x - options.xAdjustment, y: y - options.yAdjustment }
          );
        }
      }
    }
  }

  customElements.define(MapElement.is, MapElement);
})(window);
/*
(function(scope) {
  scope.FF = scope.FF || {};

  Polymer({
    is: 'ff-map',

    behaviors: [
      scope.FF.CanvasBehavior,
      scope.FF.VehicleBehavior
    ],

    properties: {
      facing: String,
      shipPosition: {
        readonly: true,
        type: Object
      },
      transition: {
        notify: true,
        type: Object
      },
      transports: {
        readonly: true,
        value: Array
      },
      vehicle: {
        readonly: true,
        type: String
      }
    },

    // Only sets position/map based on transition and fires transition done event
    transitionTo: function(transition) {
      this.positionX = undefined;
      this.positionY = undefined;
      this.positionX = transition.x;
      this.positionY = transition.y;
      this.fire('ff-map-transition-done');
    },

    _onMovingDone: function(directionOptions) {
      if (this.transition) {
        //console.log('transitioning to...');
        //console.log(this.transition);
        if (this._isWorldMap(this.mapId)) {
          this.fire('ff-save-world-map-position', {
            y: this.positionY,
            x: this.positionX
          });
        }
        if (!this.transition.shop) {
          // If going to a shop, want to keep map set for when they exit
          this.map = undefined;
        }
      }
      this.fire('ff-moving-done');
    },

  });
}(window));
*/