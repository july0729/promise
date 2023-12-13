function Promise(fn) {
  this.state = 'pending';
  this.value = null;
  this.reason = null;
  this.callbacks = [];

  const resolve = (value) => {
    setTimeout(() => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.handleCallbacks();
      }
    });
  };

  const reject = (reason) => {
    setTimeout(() => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.handleCallbacks();
      }
    });
  };

  try {
    fn(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  return new Promise((resolve, reject) => {
    this.handle({
      onFulfilled: onFulfilled || null,
      onRejected: onRejected || null,
      resolve,
      reject
    });
  });
};

Promise.prototype.handle = function (callbackObj) {
  if (this.state === 'pending') {
    this.callbacks.push(callbackObj);
    return;
  }
  const cb = this.state === 'fulfilled' ? callbackObj.onFulfilled : callbackObj.onRejected;
  //  没有提供回调  .then()
  if (!cb) return (this.state === 'fulfilled' ? callbackObj.resolve : callbackObj.reject)(this.state === 'fulfilled' ? this.value : this.reason);

  const ret = cb(this.state === 'fulfilled' ? this.value : this.reason);
  (this.state === 'fulfilled' ? callbackObj.resolve : callbackObj.reject)(ret);
};

Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    resolve(value);
  });
};


Promise.reject = function (value) {
  return new Promise((resolve, reject) => {
    reject(value);
  });
};
Promise.prototype.finally = function (callback) {
  return this.then(
    value => Promise.resolve(callback()).then(() => value),
    reason => Promise.reject(callback()).then(() => {throw reason})
  );
};

Promise.prototype.handleCallbacks = function () {
  while (this.callbacks.length) {
    const callback = this.callbacks.shift(); //删除第一个元素
    this.handle(callback);
  }
};


new Promise((resolve, reject) => {
  reject('1111')
  // resolve(1)
}).then((val) => {
  console.log('val: ', val);
}).catch((err) => {
  console.log('err: ', err);
}).finally(() => {
  console.log('rs: ', 'finally');
})