Polymer({
  is: 'ff-keyhandler',

  activate: function() {
    this._keyHandlers().forEach(function(keyHandler) {
      keyHandler.target = document.body;
    });
  },

  deactivate: function() {
    this._keyHandlers().forEach(function(keyHandler) {
      keyHandler.target = null;
    });
  },

  _go: function() {
    this.fire('ff-go');
  },

  _keyHandlers: function() {
    return Polymer.dom(this.root).querySelectorAll("[keys]");
  },

  _pressedDown: function() {
    this.fire('ff-down');
  },

  _pressedLeft: function() {
    this.fire('ff-left');
  },

  _pressedRight: function() {
    this.fire('ff-right');
  },

  _pressedUp: function() {
    this.fire('ff-up');
  }
});