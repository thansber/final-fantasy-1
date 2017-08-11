class MoveAnimationElement extends CharClassMixin(Polymer.Element) {
  static get is() { return 'ff-move-animation'; }

  static get properties() {
    return {
      data: Object,
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
    };
  }

  static get observers() {
    return [
      '_onCharacterSetup(movableId, direction, data, isReady)',
      '_onSheetLoaded(sheetLoaded)'
    ];
  }

  ready() {
    super.ready();

    this.canvas = new Canvas(this.$.canvas);
    this.canvas.resize(1, 1);
    this._loadSheet();
    this.isReady = true;
  }

  walk() {
    new Animation()
      .add(() => this._drawChar(true))
      .delay(100)
      .add(() => this._drawChar(false))
      .run();
  }

  _drawChar(isMoving) {
    this.canvas.clear();
    this.canvas.ctx.drawImage(
      this.sheet,
      this.sheetIconSize * (isMoving ? this.walkCol + 1 : this.walkCol), // y in source
      this.sheetIconSize * this.walkRow, // x in source
      this.sheetIconSize, // x-scale on source
      this.sheetIconSize, // y-scale on source
      0,
      0,
      this.canvas.scale,
      this.canvas.scale);
  }

  _loadSheet() {
    this.sheet = new Image();
    this.sheet.addEventListener('load', this.set.bind(this, 'sheetLoaded', true, undefined), false);
    this.sheet.src = this.resolveUrl('moving.png');
  }

  _onCharacterSetup(movableId, direction, data, isReady) {
    if (!this.isReady || !movableId || !this.data) {
      return;
    }

    this._movables = Object.assign({}, this.CharClasses, this.data.vehicles.byId);
    this.set('walkRow', this._movables[movableId].index);
    this.set('walkCol', this.walkColsByDirection[direction]);
    this._onSheetLoaded(this.sheetLoaded);
  }

  _onSheetLoaded(sheetLoaded) {
    if (!sheetLoaded) {
      return;
    }

    this._drawChar();
  }
}

customElements.define(MoveAnimationElement.is, MoveAnimationElement);
