((scope) => {

  scope.FF = scope.FF || {};

  class MapScreenElement extends MapMixin(ScreenMixin(ReduxMixin(Polymer.Element))) {
    static get is() { return 'ff-map-screen'; }

    static get properties() {
      return {
        mapId: {
          statePath: 'mapId',
          type: String
        },
        transitioning: {
          observer: '_disableMovement',
          reflectToAttribute: true,
          statePath: 'transitioning',
          type: Boolean
        }
      };
    }

    ready() {
      super.ready();
      this.$.topTransition.addEventListener('transitionend', e => this._onTransitionAnimationDone());
    }

    _disableMovement(transitioning) {
      if (transitioning) {
        this.$.keyhandler.deactivate();
      }
    }

    _move(direction) {
      this.dispatch({ type: 'MOVING', moving: direction });
    }

    _moveDown() { this._move('down'); }
    _moveLeft() { this._move('left'); }
    _moveRight() { this._move('right'); }
    _moveUp() { this._move('up'); }

    _onTransitionAnimationDone() {
      if (this.transitioning) {
        new scope.FF.Animation()
          .delay(600)
          .add(() => this.dispatch({ type: 'MAP_TRANSITION_JUMP' }))
          .run();
      } else {
        this.$.keyhandler.activate();
      }
    }
  }

  customElements.define(MapScreenElement.is, MapScreenElement);
})(window);
