class Animation {

  constructor() {
    this.queue = [];
  }

  add(callback, args) {
    this.queue.push(() => new Promise(resolve => resolve(callback.apply(undefined, args))));
    return this;
  }

  delay(milliseconds) {
    this.queue.push(() => new Promise(resolve => setTimeout(resolve, milliseconds)));
    return this;
  }

  run() {
    this.queue.reduce((promise, entry) => promise.then(entry), Promise.resolve());
  }
}