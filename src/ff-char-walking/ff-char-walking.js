(function(scope) {
  scope.FF = scope.FF || {};

  Polymer({
    is: 'ff-char-walking',

    behaviors: [
      scope.FF.CanvasBehavior
    ],

    properties: {
      charClass: {
        type: String
      },
      direction: {
        type: String,
        value: 'down'
      },
      sheetIconSize: {
        readonly: true,
        type: Number,
        value: 16
      },
      sheetLoaded: Boolean,
      walkCol: Number,
      walkColsByDirection: {
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
      walkRow: Number
    },

    observers: [
      '_onCharacterSetup(charClass, direction)',
      '_onSheetLoaded(sheetLoaded)'
    ],

    ready: function() {
      this.canvas = this.$.canvas;
      this.ctx = this.canvas.getContext('2d');

      this._resizeCanvas(this.canvas, 1, 1);
      this._loadSheet();
    },

    walk: function() {

    },

    _drawChar: function(isStepping) {
      this.ctx.drawImage(
        this.sheet,
        this.sheetIconSize * (isStepping ? this.walkCol + 1 : this.walkCol), // y in source
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
      this.sheet.addEventListener('load', function() {
        this.set('sheetLoaded', true);
      }.bind(this), false);
      this.sheet.src = this.resolveUrl('char-walking.png');
    },

    _onCharacterSetup: function(charClass, direction) {
      this.set('walkRow', scope.FF.CharClasses.fromId(charClass).walkRow);
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