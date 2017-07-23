(function(scope) {
  scope.FF = scope.FF || {};

  Polymer({
    is: 'ff-moving',

    behaviors: [
      scope.FF.CanvasBehavior,
      scope.FF.CharClassBehavior,
      scope.FF.VehicleBehavior,
      scope.FF.AnimationBehavior
    ],

    properties: {
      direction: {
        type: String,
        value: 'down'
      },
      movableId: {
        type: String
      },
      sheetIconSize: {
        readonly: true,
        type: Number,
        value: 32
      },
      sheetLoaded: {
        readonly: true,
        type: Boolean
      },
      walkCol: {
        readonly: true,
        type: Number
      },
      walkColsByDirection: {
        readonly: true,
        type: Object,
        value: function() {
          return {
            down: 0,
            left: 2,
            up: 4,
            right: 6
          }
        }
      },
      walkRow: {
        readonly: true,
        type: Number
      }
    },

    observers: [
      '_onCharacterSetup(movableId, direction, isReady)',
      '_onSheetLoaded(sheetLoaded)'
    ],

    ready: function() {
      this.canvas = this.$.canvas;
      this.ctx = this.canvas.getContext('2d');

      this._resizeCanvas(this.canvas, 1, 1);
      this._loadSheet();

      this._movables = Object.assign({}, this.CharClasses, this.Vehicles);

      this.isReady = true;
    },

    walk: function() {
      var animation = this.createAnimation();
      var isMoving = false;
      for (var i = 0; i < 6; i++) {
        animation
          .add(this._drawChar.bind(this, isMoving))
          .delay(80);
        isMoving = !isMoving;
      }
      animation.run();
    },

    _drawChar: function(isMoving) {
      this._clearCanvas(this.canvas, this.ctx);
      this.ctx.drawImage(
        this.sheet,
        this.sheetIconSize * (isMoving ? this.walkCol + 1 : this.walkCol), // y in source
        this.sheetIconSize * this.walkRow, // x in source
        this.sheetIconSize, // x-scale on source
        this.sheetIconSize, // y-scale on source
        0,
        0,
        this.scale,
        this.scale);
    },

    _loadSheet: function() {
      this.sheet = new Image();
      this.sheet.addEventListener('load', this.set.bind(this, 'sheetLoaded', true, undefined), false);
      this.sheet.src = this.resolveUrl('moving.png');
    },

    _onCharacterSetup: function(movableId, direction, isReady) {
      if (!this.isReady || !movableId) {
        return;
      }
      this.set('walkRow', this._movables[movableId].index);
      this.set('walkCol', this.walkColsByDirection[direction]);
      this._onSheetLoaded(this.sheetLoaded);
    },

    _onSheetLoaded: function(sheetLoaded) {
      if (!sheetLoaded) {
        return;
      }

      this._drawChar();
    }

  });
}(window));