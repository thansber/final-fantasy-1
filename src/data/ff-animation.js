(function(scope) {
  scope.FF = scope.FF || {};

  if (scope.FF.Animation) {
    return;
  }

  function Animation() {
    this.queue = [];
  };

  Object.assign(Animation.prototype, {
    add: function(callback, args) {
      this.queue.push(function() {
        return new Promise(function(resolve) {
          resolve(callback.apply(undefined, args));
        });
      });
    },

    delay: function(milliseconds) {
      this.queue.push(function() {
        return new Promise(function(resolve) {
          setTimeout(resolve, milliseconds);
        });
      });
    },

    run: function() {
      this.queue.reduce(function(promise, entry) {
        return promise.then(entry);
      }, Promise.resolve());
    }
  });

  scope.FF.Animation = Animation;

  return scope.FF.Animation;
}(window));