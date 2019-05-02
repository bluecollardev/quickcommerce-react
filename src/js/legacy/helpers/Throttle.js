export default function (fn, threshold = 250, scope = this) {
  let last
  let deferTimer

  return function () {
    let now = Date.now()
    if (last && now < last + threshold) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        fn.apply(scope, arguments)
      }, threshold)
    } else {
      last = now
      fn.apply(scope, arguments)
    }
  }
}
