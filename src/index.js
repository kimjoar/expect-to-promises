import invariant from 'invariant'
import isPromise from 'is-promise'

const eventually = (test) => (obj) => {
  const { actual, assert } = obj

  invariant(isPromise(actual), '`actual` is not a promise')

  return actual.then(
    (val) => test({ ...obj, actual: val }),
    () => assert(false, 'Expected to eventually resolve, but was rejected')
  )
}

export { eventually }
