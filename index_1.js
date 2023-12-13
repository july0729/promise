// new Promise((resolve,reject)=>{}).then().catch().finally()

//Promise 接收一个执行器函数
function Promise(Fn) {
  this.callbackls = []
  const self = this
  const resolve = function (value) {
    setTimeout(() => {
      self.data = value
      self.callbackls.map((cb) => cb(value))
    });
  }
  Fn(resolve)
}

// .then( (res) => {})
Promise.prototype.then = function (resolved) {
  return new Promise((resolve) => {
    this.callbackls.push(() => {
      const res = resolved(this.data)
      if (res instanceof Promise) {
        res.then(resolve)
        console.log(111);
      } else {
        resolve(res)
        console.log(222);
      }
    })
  })
}

const promise = new Promise((resolve) => {
  resolve(1)
}).then((res) => {
  console.log('res: ', res);
})
console.log('promise: ', promise);