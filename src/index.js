import invariant from 'invariant'
import isPromise from 'is-promise'

const eventually = (test) => (obj) => {
  const { actual, assert, not } = obj

  invariant(!not, "`eventually` can't be wrapped in a `not`, use `eventually(not(...))` instead")
  invariant(isPromise(actual), '`actual` is not a promise')

  return actual.then(
    (val) => test({ ...obj, actual: val }),
    () => assert(false, 'Expected to eventually resolve, but was rejected')
  )
}

const beFulfilled = ({ actual, assert, not }) => {
  invariant(!not, 'Use `beRejected` instead of `not(beFulfilled)`')
  invariant(isPromise(actual), '`actual` is not a promise')

  return actual.then(
    () => undefined,
    () => assert(false, 'Expected promise to be fulfilled')
  )
}

const beRejected = ({ actual, assert, not }) => {
  invariant(!not, 'Use `beFulfilled` instead of `not(beRejected)`')
  invariant(isPromise(actual), '`actual` is not a promise')

  return actual.then(
    (val) => assert(false, ['Expected promise to be rejected, but resolved to %j', val]),
    () => undefined
  )
}

export { eventually, beFulfilled, beRejected }
