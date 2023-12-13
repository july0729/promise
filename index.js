
// 先看调用写法   new Promise((resolve,reject)=>{}).then.catch

//  new Promise(resolve)
//Promise声明函数 默认接受一个执行器函数 函数的第一个参数是resolve
function Promise(fn) {
  this.callbackls = []
  const self = this
  const resolve = function (value) {
    return setTimeout(() => {
      self.data = value
      self.callbackls.forEach((cb) => cb(value))   //遍历并调用 回调列表内的所有回调  
    });
  }
  fn(resolve)  //执行用户传入的函数 
}

//把then挂在原型上进行共享
//当用户调用then的时候 会创建一个新的回调onResolved  
// 重新 new 一个promise  promise 默认接收resolve

Promise.prototype.then = function (onResolved) {
  // promise 默认接受一个resolve 参数
  return new Promise((resolve) => {
    // then接收的永远是resolve   .then(()=>{})   
    // this.callbackls.push 是将一个新的回调添加到callbackls
    this.callbackls.push(() => {
      // this.data 是promise的结果 传入onResolved
      //表示 当你在then方法传入一个函数是，这个函数会接受到promise的返回结果  then((res)=>{})   //this.data就是那个res
      const res = onResolved(this.data)
      // 如果res是一个promise 那就用then接收  否则就用resolve传递
      if (res instanceof Promise) {
        res.then(resolve)
      } else {
        resolve(res);
      }
    })
  })
}


const promise1 = new Promise((resolve) => {
  resolve(1)
})

promise1.then((res) => {
  console.log('res: ', res);
  return new Promise((resolve) => {
    resolve(2)
  })
}).then((rr) => {
  console.log('rr: ', rr);

})