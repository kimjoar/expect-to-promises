/* eslint-env mocha */

import assert from 'assert'
import sinon from 'sinon'
import Promise from 'bluebird'
import { not, be } from 'expect-to-core'
import {
  eventually,
  beFulfilled,
  beRejected
} from './src'

const extractAssert = (spy) => spy.args[0][0]
const noopAssert = { not: {} }

describe('expect-to-promises', () => {
  describe('eventually', () => {
    it('throws when not given a promise', () => {
      assert.throws(
        () => {
          const spy = sinon.spy()
          eventually()({
            actual: null,
            assert: spy
          })
        },
        (err) => err.message === '`actual` is not a promise'
      )
    })

    it('throws when eventually is wrapped in a not', () => {
      assert.throws(
        () => {
          not(eventually())({
            actual: null,
            assert: noopAssert
          })
        },
        (err) => err.message === "`eventually` can't be wrapped in a `not`, use `eventually(not(...))` instead"
      )
    })

    context('when resolved', () => {
      it('unwraps resolved value', (done) => {
        const assertion = ({ actual }) => {
          assert.equal(actual, 'foo')
          done()
        }

        eventually(assertion)({
          actual: Promise.resolve('foo')
        })
      })

      it('allows assertion within eventually', () => {
        const spy = sinon.spy()

        return eventually(be('foo'))({
          actual: Promise.resolve('foo'),
          assert: spy
        }).then(() => {
          sinon.assert.calledWithExactly(
            spy,
            true,
            ['Expected %j to be %j', 'foo', 'foo'],
            ['Expected %j not to be %j', 'foo', 'foo'],
            'foo'
          )
        })
      })

      it('handles inner assertion with not', () => {
        const spy = sinon.spy()

        const _assert = {
          not: spy
        }

        return eventually(not(be('foo')))({
          actual: Promise.resolve('bar'),
          assert: _assert
        }).then(() => {
          assert.equal(extractAssert(spy), false)
        })
      })
    })

    context('when rejected', () => {
      it('rejects with the expected error', () => {
        const spy = sinon.spy()

        return eventually(be('foo'))({
          actual: Promise.reject(new Error('test')),
          assert: spy
        }).then(() => {
          sinon.assert.calledWithExactly(
            spy,
            false,
            'Expected to eventually resolve, but was rejected'
          )
        })
      })
    })
  })

  describe('beFulfilled', () => {
    context('when fulfilled', () => {
      it('succeeds', () => {
        const spy = sinon.spy()

        return beFulfilled({
          actual: Promise.resolve('foo'),
          assert: spy
        })
      })
    })

    context('when rejected', () => {
      it('fails', () => {
        const spy = sinon.spy()

        return beFulfilled({
          actual: Promise.reject(new Error('test')),
          assert: spy
        }).then(() => {
          sinon.assert.calledWithExactly(
            spy,
            false,
            'Expected promise to be fulfilled'
          )
        })
      })
    })

    it('throws when wrapped in `not`', () => {
      assert.throws(
        () => {
          not(beFulfilled)({
            actual: Promise.resolve('foo'),
            assert: noopAssert
          })
        },
        (err) => err.message === 'Use `beRejected` instead of `not(beFulfilled)`'
      )
    })
  })

  describe('beRejected', () => {
    context('when rejected', () => {
      it('succeeds', () => {
        const spy = sinon.spy()

        return beRejected({
          actual: Promise.reject(new Error('foo')),
          assert: spy
        })
      })
    })

    context('when fulfilled', () => {
      it('fails', () => {
        const spy = sinon.spy()

        return beRejected({
          actual: Promise.resolve('foo'),
          assert: spy
        }).then(() => {
          sinon.assert.calledWithExactly(
            spy,
            false,
            ['Expected promise to be rejected, but resolved to %j', 'foo']
          )
        })
      })
    })

    it('throws when wrapped in `not`', () => {
      assert.throws(
        () => {
          not(beRejected)({
            actual: Promise.resolve('foo'),
            assert: noopAssert
          })
        },
        (err) => err.message === 'Use `beFulfilled` instead of `not(beRejected)`'
      )
    })
  })
})
