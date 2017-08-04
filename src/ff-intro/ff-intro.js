class IntroElement extends ScreenMixin(Polymer.Element) {
  static get is() { return 'ff-intro'; }

  onScreenClosed() {
    this.animations.forEach(a => a.cancel());
  }

  onScreenOpened() {
    //this.playAnimation('entry');
    let nodes = this.shadowRoot.querySelectorAll('p');
    let fadeIn = [
      {'opacity': '0'},
      {'opacity': '1'}
    ];
    let timing = {
      delay: 0,
      duration: 1000,
      easing: 'steps(4, start)'
    };
    const delayBetweenNodes = 1250;

    this.animations = Array.from(nodes).map((n, i) => {
      let nodeTiming = Object.assign({}, timing, {
        delay: timing.delay + (i * delayBetweenNodes)
      });
      let animation = n.animate(fadeIn, nodeTiming);
      animation.onfinish = () => n.classList.toggle('done');
      return animation;
    });
  }

  _toMenu() {
    this.dispatchEvent(new CustomEvent('ff-screen', {
      bubbles: true,
      composed: true,
      detail: {
        screen: 'openingMenu'
      }
    }));
  }
}

customElements.define(IntroElement.is, IntroElement);
